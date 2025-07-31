use anchor_lang::prelude::*;

use crate::{constant::DAO_CONFIG_SEED, DaoConfig, DAO_CONFIG_SIZE};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(
        init,
        space = DAO_CONFIG_SIZE,
        payer = admin,
        seeds = [
            DAO_CONFIG_SEED,
        ],
        bump,
    )]
    pub dao_config: Account<'info, DaoConfig>,

    pub system_program: Program<'info, System>,
}

impl <'info> Initialize <'info> {
    pub fn initialize(&mut self, reward_mint: Pubkey) -> Result<()> {
        let dao_config = &mut self.dao_config;

        dao_config.admin = self.admin.key();
        dao_config.reward_mint = reward_mint;

        Ok(())
    }
}