use anchor_lang::prelude::*;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use crate::{
    error::AppError,
    constant::{DAO_CONFIG_SEED, QUESTION_SEED, VOTE_RECORD_SEED}, DaoConfig, Question, VoteRecord
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        mut,
        seeds = [
            DAO_CONFIG_SEED,
        ],
        bump,
    )]
    pub dao_config: Account<'info, DaoConfig>,

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
        mut,
        seeds = [
            VOTE_RECORD_SEED,
            user.key().as_ref(),
            id.to_le_bytes().as_ref(),
        ],
        bump
    )]
    pub vote_record: Account<'info, VoteRecord>,

    #[account(
        mut,
        constraint = token_mint.key() == dao_config.reward_mint
    )]
    pub token_mint: Account<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = user,
        
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

impl <'info> ClaimReward <'info> {
    pub fn process(&mut self) -> Result<()> {
        let vote_record = &mut self.vote_record;
        let question = &mut self.question;

        require!(vote_record.has_voted, AppError::NotVote);
        require!(!vote_record.claimed, AppError::AlreadyClaimed);

        // Check if the current timestamp is after the question's deadline
        let clock = Clock::get()?;
        require!(clock.unix_timestamp > question.deadline, AppError::NotAfterDeadline);

        let ctx = CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.token_mint.to_account_info(),
                to: self.user_token_account.to_account_info(),
                authority: self.dao_config.to_account_info(),
            },
        );

        mint_to(ctx, self.question.reward_per_vote)?;

        vote_record.claimed = true;
        Ok(())
    }
}