use anchor_lang::prelude::*;

#[account]
pub struct VoteRecord {
    pub choice: u8,
    pub has_voted: bool,
    pub claimed: bool,
}

pub const VOTE_RECORD_SIZE: usize = 8 + 1 + 1 + 1;
