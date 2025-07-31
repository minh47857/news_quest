use anchor_lang::{prelude::*};

use crate::{
    error::AppError,
    constant::{QUESTION_SEED, VOTE_RECORD_SEED}, 
    Question, VoteRecord, VOTE_RECORD_SIZE
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct Vote<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [
            QUESTION_SEED,
            id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub question: Account<'info, Question>,

    #[account(
        init_if_needed,
        payer = user,
        space = VOTE_RECORD_SIZE,
        seeds = [
            VOTE_RECORD_SEED,
            user.key().as_ref(),
            id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,

    pub system_program: Program<'info, System>,
}

impl <'info> Vote<'info> {
    pub fn process(&mut self, choice: u8) -> Result<()> {
        let question = &mut self.question;
        let vote_record = &mut self.vote_record;

        require!(question.is_active, AppError::QuestionInActive);
        require!(vote_record.has_voted == false, AppError::QuestionAlreadyVoted);

        require!(
            (choice as usize) < question.choices.len(),
            AppError::InvalidChoices
        );

        vote_record.choice = choice;
        vote_record.has_voted = true;

        question.choices[choice as usize].total_votes += 1;
        question.total_votes += 1;

        Ok(())
    }
    
}