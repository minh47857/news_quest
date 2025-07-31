use anchor_lang::prelude::*;

#[account]
pub struct DaoConfig {
    pub admin: Pubkey,
    pub total_questions: u64,
    pub reward_mint: Pubkey, 
}