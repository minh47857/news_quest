use anchor_lang::prelude::*;

use crate::{constant::DAO_CONFIG_SEED, DaoConfig, DAO_CONFIG_SIZE};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub addr: Signer<'info>,

    #[account(
        init,
        space = DAO_CONFIG_SIZE,
        payer = addr,
        seeds = [
            DAO_CONFIG_SEED,
        ],
        bump,
    )]
    pub dao_config: Account<'info, DaoConfig>,

    pub system_program: Program<'info, System>,
}

impl <'info> Initialize <'info> {
    pub fn initialize(&mut self, reward_mint: Pubkey, is_admin: bool) -> Result<()> {
        let dao_config = &mut self.dao_config;

        dao_config.addr = self.addr.key();
        dao_config.reward_mint = reward_mint;
        dao_config.is_admin = is_admin;

        Ok(())
    }
}