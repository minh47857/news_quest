use anchor_lang::prelude::*;
use crate::{Question, constant::QUESTION_SEED};

#[derive(Accounts)]
pub struct ViewChoices<'info> {
    #[account(
        seeds = [QUESTION_SEED, question.id.to_le_bytes().as_ref()],
        bump,
    )]
    pub question: Account<'info, Question>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ViewChoicesOutput {
    pub choices: Vec<crate::state::Choice>,
}

pub fn view_choices(ctx: Context<ViewChoices>, _question_id: u64) -> Result<ViewChoicesOutput> {
    let question = &ctx.accounts.question;
    Ok(ViewChoicesOutput {
        choices: question.choices.clone(),
    })
}

// -----------------------

#[derive(Accounts)]
pub struct GetTotalVotes<'info> {
    #[account(
        seeds = [QUESTION_SEED, question.id.to_le_bytes().as_ref()],
        bump,
    )]
    pub question: Account<'info, Question>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct GetTotalVotesOutput {
    pub total_votes: u64,
}

pub fn get_total_votes(ctx: Context<GetTotalVotes>, _id: u64) -> Result<GetTotalVotesOutput> {
    let question = &ctx.accounts.question;
    Ok(GetTotalVotesOutput {
        total_votes: question.total_votes,
    })
}
