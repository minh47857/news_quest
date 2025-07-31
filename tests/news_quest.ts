import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NewsQuest } from "../target/types/news_quest";
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("news_quest", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.NewsQuest as Program<NewsQuest>;
  const payer = provider.wallet as anchor.Wallet;
  let daoConfig: Keypair;
  it("Tạo câu hỏi thành công", async () => {
    daoConfig = Keypair.generate();
    const space = 8 + 32 + 8 + 32; // discriminator + admin + total_questions + reward_mint
    const lamports = await provider.connection.getMinimumBalanceForRentExemption(space);
    const tx = new anchor.web3.Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: daoConfig.publicKey,
        space,
        lamports,
        programId: program.programId,
      })
    );
    await provider.sendAndConfirm(tx, [payer.payer, daoConfig]);

    const questionId = 0;
    const [questionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("question"), new anchor.BN(questionId).toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    await program.methods
      .createQuest(
        new anchor.BN(questionId),
        "Dự đoán thị trường",
        "https://example.com/image.png",
        ["Tăng", "Giảm"],
        new anchor.BN(Math.floor(Date.now() / 1000) + 3600),
        new anchor.BN(100)
      )
      .accounts({
        payer: payer.publicKey,
        question: questionPda,
        daoConfig: daoConfig.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    const question = await program.account.question.fetch(questionPda);
    assert.equal(question.title, "Dự đoán thị trường");
    assert.equal(question.choices.length, 2);
    assert.equal(question.rewardPerVote.toNumber(), 100);
  });
});
