use anchor_lang::constant;

#[constant]
pub const VOTE_RECORD_SEED: &[u8] = b"vote_record";

#[constant]
pub const DAO_CONFIG_SEED: &[u8] = b"dao_config";

#[constant]
pub const QUESTION_SEED: &[u8] = b"question";

#[constant]
pub const MAX_TITLE_LENGTH: usize = 200; // Độ dài tối đa của tiêu đề

#[constant]
pub const MAX_CHOICES: usize = 10;       // Số lựa chọn tối đa

#[constant]
pub const MAX_DESCRIPTION_LENGTH: usize = 32; // Độ dài tối đa của mô tả lựa chọn
