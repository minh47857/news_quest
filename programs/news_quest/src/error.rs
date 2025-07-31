use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    #[msg("Invalid number of choices")]
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

    #[msg("Reward cannot be claimed after the deadline")]
    NotAfterDeadline,

    #[msg("The question has already ended.")]
    QuestionAlreadyEnded,
    
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}