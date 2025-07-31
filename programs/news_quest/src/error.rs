use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    #[msg("Invalid number of choices (must be between 2 and 10)")]
    InvalidChoices,

    #[msg("Question count overflow")]
    Overflow,

    #[msg("Invalid question ID")]
    InvalidQuestionId,

    #[msg("User has already voted for this question")]
    QuestionAlreadyVoted,

    #[msg("Question is not active")]
    QuestionInActive,

    #[msg("User did not select the correct choice")]
    NotCorrectChoice,

    #[msg("User has not voted yet")]
    NotVote,

    #[msg("Reward has already been claimed")]
    AlreadyClaimed,
}