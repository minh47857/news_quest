use anchor_lang::prelude::*;
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
/* Struct Choice */
pub struct Choice {
    pub description: String,
    pub total_votes: u8,
}
/* Struc NFT Question*/
#[account]
pub struct Question {
    pub id:u64,
    pub nft_address: Pubkey, // Address of the question
    pub title: String,
    pub image_uri: String,
    pub choices: Vec<Choice>,
    pub is_active: bool,
    pub deadline: i64, // unix timestamp
    pub reward_per_vote: u64,
    pub total_votes: u64,
    pub correct_choice: u8, // index of the correct choice
}
/* Struct luu tru thong tin DAO */
#[account]
pub struct DaoConfig {
    pub admin: Pubkey,
    pub total_questions: u64,
    pub reward_mint: Pubkey, /* dia chi mint cua SPL token thuong */
}