use anchor_lang::prelude::*;

use crate::constant::{MAX_CHOICES, MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH};

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Choice {
    pub description: String,
    pub total_votes: u8,
}

#[account]
pub struct Question {
    pub id: u64,
    pub nft_address: Pubkey,
    pub title: String,
    pub image_uri: String,
    pub choices: Vec<Choice>,
    pub is_active: bool,
    pub deadline: i64, 
    pub reward_per_vote: u64,
    pub total_votes: u64,
    pub correct_choice: u8, 
}

pub const QUESTION_SIZE: usize = 8 + // discriminator
    8 + // id: u64
    32 + // nft_address: Pubkey
    4 + MAX_TITLE_LENGTH + // title: String (max 128 bytes)
    4 + 256 + // image_uri: String (max 256 bytes)
    4 + (MAX_CHOICES * (4 + MAX_DESCRIPTION_LENGTH + 1)) + // choices: Vec<Choice> (max 8 choices, each with description String (max 128 bytes) + total_votes: u8)
    1 + // is_active: bool
    8 + // deadline: i64
    8 + // reward_per_vote: u64
    8 + // total_votes: u64
    1; // correct_choice: u8
