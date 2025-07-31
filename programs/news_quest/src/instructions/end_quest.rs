use anchor_lang::prelude::*;

use crate::{
    constant::{QUESTION_SEED},
    error::AppError,
    Question,
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct EndQuest<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        mut,
        seeds = [
            QUESTION_SEED,
            id.to_le_bytes().as_ref(),
        ],
        bump,
    )]
    pub question: Account<'info, Question>,
}

impl<'info> EndQuest<'info> {
    pub fn process(&mut self) -> Result<()> {
        let question = &mut self.question;
        require!(question.is_active, AppError::QuestionAlreadyEnded);
        question.is_active = false;
        Ok(())
    }
}
