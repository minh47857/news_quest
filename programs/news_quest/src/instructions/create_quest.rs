use anchor_lang::prelude::*;

use crate::{constant::{DAO_CONFIG_SEED, QUESTION_SEED}, error::AppError, Choice, DaoConfig, Question, QUESTION_SIZE};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct CreateQuest<'info> {
    #[account(mut)]
    pub admin: Signer<'info>, 

    #[account(
        mut,
        seeds = [
            DAO_CONFIG_SEED,
        ],
        bump,
    )]
    pub dao_config: Account<'info, DaoConfig>,

    #[account(
        init,
        payer = admin,
        space = QUESTION_SIZE,
        seeds = [
            QUESTION_SEED,
            id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub question: Account<'info, Question>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl <'info> CreateQuest <'info> {
    pub fn process(
        &mut self,
        id: u64,
        title: String,
        image_uri: String,
        choices: Vec<String>,
        deadline: i64,
        reward_per_vote: u64,
    ) -> Result<()> {
        let question = &mut  self.question;
        let dao_config = &mut self.dao_config;

        require!(
            choices.len() >= 2 && choices.len() <= 10,
            AppError::InvalidChoices
        );

        require!(
            id == dao_config.total_questions,
            AppError::InvalidQuestionId
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

        dao_config.total_questions = dao_config
            .total_questions
            .checked_add(1)
            .ok_or(AppError::Overflow)?;

        Ok(())
    }
}