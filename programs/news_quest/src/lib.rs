use anchor_lang::prelude::*;
pub mod state;
pub mod instructions;
use instructions::create_quest::*;

declare_id!("6LWu2MDNZyBkkJ2gr6KL2hPqkRmDUac6VNNuw4TCdKEX");

#[program]
pub mod news_quest {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
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
        instructions::create_quest::create_quest(ctx, id, title, image_uri, choices, deadline, reward_per_vote)
    }
}

#[derive(Accounts)]
pub struct Initialize {}