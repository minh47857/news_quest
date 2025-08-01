use anchor_lang::prelude::*;
pub mod state;
pub mod instructions;
pub use state::*;
pub use instructions::*;
mod constant;
mod error;

declare_id!("6LWu2MDNZyBkkJ2gr6KL2hPqkRmDUac6VNNuw4TCdKEX");

#[program]
pub mod news_quest {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, reward_mint: Pubkey, is_admin: bool) -> Result<()> {
        ctx.accounts.initialize(reward_mint, is_admin)
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
        ctx.accounts.process(id, title, image_uri, choices, deadline, reward_per_vote)
    }

    pub fn vote(ctx: Context<Vote>, _id: u64,  choice: u8) -> Result<()> {
        ctx.accounts.process(choice)
    }

    pub fn claim_reward(ctx: Context<ClaimReward>, _id: u64) -> Result<()> {
        ctx.accounts.process()
    }
    
    pub fn end_quest(ctx: Context<EndQuest>, _id: u64) -> Result<()> {
        ctx.accounts.process()
    }
}

