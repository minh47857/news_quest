import { AnchorProvider, Program, utils } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import NewsQuestIdl from "../../../target/idl/news_quest.json";
import * as anchor from "@coral-xyz/anchor";
import { Buffer } from "buffer";

export default class NewsQuestProgram {
  constructor(provider) {
    this.provider = provider;
    this.program = new Program(NewsQuestIdl, provider);
  }

  // Tạo PDA cho dao_config
  getDaoConfigPDA() {
    const [daoConfig] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("dao_config")],
      this.program.programId
    );
    return daoConfig;
  }

  getQuestionPDA(questionId, programId) {
    console.log("hello");
    return PublicKey.findProgramAddressSync(
      [Buffer.from("question"), questionId.toArrayLike(Buffer, "le", 8)],
      this.program.programId
    )[0];
    console.log("bye");
  }
  
  // Tạo PDA cho vote_record
  getVoteRecordPDA(questionId, programId) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vote_record"), this.provider.publicKey.toBuffer(), new anchor.BN(questionId).toArrayLike(Buffer, "le", 8)],
      programId
    )[0];
  }

  // Lấy total questions từ dao_config
  async getTotalQuestions() {
    try {
      const daoConfigPDA = this.getDaoConfigPDA();
      const daoConfig = await this.program.account.daoConfig.fetch(daoConfigPDA);
      return daoConfig.totalQuestions;
    } catch (error) {
      console.error("Error fetching total questions:", error);
      return 0;
    }
  }

  // Tạo quest
  createQuest(questionId, title, imageUri, choices, deadline, rewardPerVote) {
    const daoConfigPDA = this.getDaoConfigPDA();
    console.log(daoConfigPDA);

    const questionPDA = this.getQuestionPDA(questionId);
    console.log(questionPDA);

    const builder = this.program.methods
      .createQuest(
        new anchor.BN(questionId),
        title,
        imageUri,
        choices,
        new anchor.BN(deadline),
        new anchor.BN(rewardPerVote)
      )
      .accounts({
        admin: this.provider.publicKey,
        daoConfig: daoConfigPDA,
        question: questionPDA,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      });
    
    console.log("1");

    return builder.transaction();
  }

  // Vote cho question
  vote(questionId, choice) {
    const questionPDA = this.getQuestionPDA(questionId);
    const voteRecordPDA = this.getVoteRecordPDA(questionId);

    const builder = this.program.methods
      .vote(new anchor.BN(questionId), choice)
      .accounts({
        user: this.provider.publicKey,
        question: questionPDA,
        voteRecord: voteRecordPDA,
        systemProgram: SystemProgram.programId,
      });

    return builder.transaction();
  }

  // End quest
  endQuest(questionId) {
    const daoConfigPDA = this.getDaoConfigPDA();
    const questionPDA = this.getQuestionPDA(questionId);

    const builder = this.program.methods
      .endQuest(new anchor.BN(questionId))
      .accounts({
        admin: this.provider.publicKey,
        daoConfig: daoConfigPDA,
        question: questionPDA,
      });

    return builder.transaction();
  }

  // Claim reward
  claimReward(questionId) {
    const daoConfigPDA = this.getDaoConfigPDA();
    const questionPDA = this.getQuestionPDA(questionId);
    const voteRecordPDA = this.getVoteRecordPDA(questionId);

    const builder = this.program.methods
      .claimReward(new anchor.BN(questionId))
      .accounts({
        admin: this.provider.publicKey,
        user: this.provider.publicKey,
        daoConfig: daoConfigPDA,
        question: questionPDA,
        voteRecord: voteRecordPDA,
        tokenMint: anchor.utils.token.TOKEN_PROGRAM_ID,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      });

    return builder.transaction();
  }

  // Fetch question
  async fetchQuestion(questionId) {
    const questionPDA = this.getQuestionPDA(questionId);
    return await this.program.account.question.fetch(questionPDA);
  }

  // Fetch dao config
  async fetchDaoConfig() {
    const daoConfigPDA = this.getDaoConfigPDA();
    return await this.program.account.daoConfig.fetch(daoConfigPDA);
  }
}