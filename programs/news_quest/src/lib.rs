use anchor_lang::prelude::*;

declare_id!("5Whv2g9gDJZnj9nsh2DFgQS9KQek7PZT4CJZeGxB1RxY");

#[program]
pub mod news_quest {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
