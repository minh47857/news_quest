use anchor_lang::prelude::*;

use crate::{
    constant::{QUESTION_SEED, DAO_CONFIG_SEED},
    error::AppError,
    Question, DaoConfig,
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct EndQuest<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        seeds = [DAO_CONFIG_SEED],
        bump,
    )]
    pub dao_config: Account<'info, DaoConfig>,

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
        require_keys_eq!(
            self.dao_config.admin,
            self.admin.key(),
            AppError::Unauthorized
        );
        let question = &mut self.question;
        require!(question.is_active, AppError::QuestionAlreadyEnded);
        question.is_active = false;
        Ok(())
    }
}
