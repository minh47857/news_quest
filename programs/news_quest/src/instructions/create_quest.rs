use anchor_lang::prelude::*;

use crate::state::{Question, Choice, DaoConfig};

#[derive(Accounts)]
pub struct CreateQuest<'info> {
    #[account(mut)]
    pub payer: Signer<'info>, // Người trả phí để tạo account

    #[account(
        init,
        payer = payer,
        space = 8 + 8 + 32 + 4 + 200 + 4 + 200 + 4 + (4 + 32 + 1) * 10 + 1 + 8 + 8 + 1,
        seeds = [b"question", dao_config.total_questions.to_le_bytes().as_ref()],
        bump
    )]
    pub question: Account<'info, Question>,

    #[account(mut)]
    pub dao_config: Account<'info, DaoConfig>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_quest(
    ctx: Context<CreateQuest>,
    id: u64,
    title: String,
    image_uri: String,
    choices: Vec<String>,
    deadline: i64,
    reward_per_vote: u64,
) -> Result<()> {
    let question = &mut ctx.accounts.question;
    let dao_config = &mut ctx.accounts.dao_config;

    require!(
        choices.len() >= 2 && choices.len() <= 10,
        QuestError::InvalidChoices
    );

    require!(
        id == dao_config.total_questions,
        QuestError::InvalidQuestionId
    );

    let choice_list: Vec<Choice> = choices
        .into_iter()
        .map(|desc| Choice {
            description: desc,
            total_votes: 0,
        })
        .collect();

    question.id = id;
    question.nft_address = question.key(); // Lưu PDA của Question
    question.title = title;
    question.image_uri = image_uri;
    question.choices = choice_list;
    question.is_active = true;
    question.deadline = deadline;
    question.reward_per_vote = reward_per_vote;
    question.total_votes = 0;
    question.correct_choice = 0;

    dao_config.total_questions = dao_config
        .total_questions
        .checked_add(1)
        .ok_or(QuestError::Overflow)?;

    Ok(())
}

#[error_code]
pub enum QuestError {
    #[msg("Số lượng lựa chọn không hợp lệ (phải từ 2 đến 10)")]
    InvalidChoices,
    #[msg("Tràn số câu hỏi")]
    Overflow,
    #[msg("ID câu hỏi không hợp lệ")]
    InvalidQuestionId,
}
