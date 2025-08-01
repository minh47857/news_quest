import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NewsQuest } from "../target/types/news_quest";
import { PublicKey, Keypair } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { assert } from "chai";
import * as dotenv from "dotenv";
import bs58 from "bs58";

dotenv.config();

describe("news_quest", () => {
  const provider = new anchor.AnchorProvider(
    new anchor.web3.Connection(process.env.RPC_URL!, "confirmed"),
    new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(bs58.decode(process.env.PAYER_SECRET_KEY!))),
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);
  const program = anchor.workspace.NewsQuest as Program<NewsQuest>;
  const payer = provider.wallet as anchor.Wallet;

  let daoConfig: PublicKey;
  let rewardMint: PublicKey;
  let rewardToken: PublicKey;
  let questionId = new anchor.BN(0);
  let questionPDA: PublicKey;

  before(async () => {
    daoConfig = PublicKey.findProgramAddressSync(
      [Buffer.from("dao_config")],
      program.programId
    )[0];

    rewardMint = await createMint(provider.connection, payer.payer, payer.publicKey, null, 9);
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      rewardMint,
      payer.publicKey,
      true // force creation
    );
    rewardToken = tokenAccount.address;

    // Kiểm tra xem dao_config đã tồn tại chưa
    try {
      const daoConfigState = await program.account.daoConfig.fetch(daoConfig);
      console.log("dao_config đã tồn tại:", daoConfigState);
      questionId = new anchor.BN(daoConfigState.totalQuestions.toNumber());
    } catch (err) {
      // Nếu chưa tồn tại, khởi tạo dao_config
      await program.methods
        .initialize(rewardMint)
        .accounts({
          admin: payer.publicKey,
          daoConfig,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([payer.payer])
        .rpc();
      console.log("Initialized dao_config");
    }

    // Cập nhật questionPDA dựa trên questionId
    questionPDA = PublicKey.findProgramAddressSync(
      [Buffer.from("question"), questionId.toArrayLike(Buffer, "le", 8)],
      program.programId
    )[0];
  });

  it("Initialize DAO Config", async () => {
    const daoConfigState = await program.account.daoConfig.fetch(daoConfig);
    assert.equal(daoConfigState.admin.toString(), payer.publicKey.toString(), "Admin không đúng");
    assert.equal(daoConfigState.rewardMint.toString(), rewardMint.toString(), "Reward mint không đúng");
  });

  it("Create Quest", async () => {
    const title = "What is your favorite color?";
    const imageUri = "https://example.com/image.png";
    const choices = ["Red", "Blue", "Green"];
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const rewardPerVote = new anchor.BN(100);

    // Kiểm tra xem câu hỏi đã tồn tại chưa
    try {
      await program.account.question.fetch(questionPDA);
      console.log("Question đã tồn tại, bỏ qua tạo mới");
    } catch (err) {
      const tx = await program.methods
        .createQuest(questionId, title, imageUri, choices, new anchor.BN(deadline), rewardPerVote)
        .accounts({
          payer: payer.publicKey,
          question: questionPDA,
          daoConfig,
          rewardMint,
          rewardToken,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([payer.payer])
        .rpc();

      console.log("Created quest. Tx:", tx);
    }

    const question = await program.account.question.fetch(questionPDA);
    assert.equal(question.id.toNumber(), questionId.toNumber(), "ID không khớp");
    assert.equal(question.nftAddress.toString(), questionPDA.toString(), "nft_address không khớp");
    assert.equal(question.title, title, "Tiêu đề không khớp");
    assert.equal(question.imageUri, imageUri, "Image URI không khớp");
    assert.equal(question.choices.length, 3, "Số lựa chọn không khớp");
    assert.isTrue(question.isActive, "is_active không đúng");
    assert.equal(question.deadline.toNumber(), deadline, "Deadline không khớp");
    assert.equal(question.rewardPerVote.toNumber(), rewardPerVote.toNumber(), "Reward không khớp");

    const daoConfigState = await program.account.daoConfig.fetch(daoConfig);
    assert.equal(daoConfigState.totalQuestions.toNumber(), questionId.toNumber() + 1, "total_questions không tăng");
  });

  it("End Quest", async () => {
    const title = "What is your favorite color?";
    const imageUri = "https://example.com/image.png";
    const choices = ["Red", "Blue", "Green"];
    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const rewardPerVote = new anchor.BN(100);

    questionId = new anchor.BN(questionId.toNumber() + 1); // tang id
    questionPDA = PublicKey.findProgramAddressSync(
      [Buffer.from("question"), questionId.toArrayLike(Buffer, "le", 8)],
      program.programId
    )[0];
    const txCreate = await program.methods
      .createQuest(questionId, title, imageUri, choices, new anchor.BN(deadline), rewardPerVote)
      .accounts({
        payer: payer.publicKey,
        question: questionPDA,
        daoConfig,
        rewardMint,
        rewardToken,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([payer.payer])
      .rpc();

    console.log("Created new quest. Tx:", txCreate);

    const tx = await program.methods
      .endQuest(questionId)
      .accounts({
        admin: payer.publicKey,
        question: questionPDA,
        daoConfig,
      })
      .signers([payer.payer])
      .rpc();

    console.log("Ended quest. Tx:", tx);

    const question = await program.account.question.fetch(questionPDA);
    assert.isFalse(question.isActive, "Quest không được kết thúc");
  });

  it("Fails to end quest if not admin", async () => {
    const fakeAdmin = Keypair.generate();

    try {
      await program.methods
        .endQuest(questionId)
        .accounts({
          admin: fakeAdmin.publicKey,
          question: questionPDA,
          daoConfig,
        })
        .signers([fakeAdmin])
        .rpc();

      assert.fail("Lẽ ra không được phép end_quest khi không phải admin");
    } catch (err: any) {
      const errStr = err.toString();
      console.log("Lỗi nhận được:", errStr);
      assert.include(errStr, "Unauthorized", "Không đúng lỗi do không phải admin");
    }
  });
});