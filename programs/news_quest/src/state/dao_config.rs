use anchor_lang::prelude::*;

#[account]
pub struct DaoConfig {
    pub addr: Pubkey,
    pub total_questions: u64,
    pub reward_mint: Pubkey, 
    pub is_admin: bool,
}

pub const DAO_CONFIG_SIZE: usize = 8 + 32 + 8 + 32 + 1;