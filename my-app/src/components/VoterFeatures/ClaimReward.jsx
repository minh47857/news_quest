import React, { useState } from "react";
import { Input, Button, VStack, useToast, Heading, Box } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import idl from "../../idl/news_quest.json";
import { BN } from "bn.js";
import { Buffer } from "buffer";


const ClaimReward = () => {
  const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
  const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGVdyoVbCjHbSTvF6r9f9BeY6bD1tqhZy5iTjHL");

  const [questId, setQuestId] = useState("");
  const toast = useToast();

  const handleClaim = async () => {
    try {
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error("Please install Phantom Wallet.");
      }

      const provider = new AnchorProvider(
        new web3.Connection("https://api.devnet.solana.com"),
        window.solana,
        { preflightCommitment: "processed" }
      );

      if (typeof window !== "undefined") {
        window.Buffer = Buffer;
      }

      const programId = new PublicKey("5Whv2g9gDJZnj9nsh2DFgQS9KQek7PZT4CJZeGxB1RxY");
      const program = new Program(idl, provider);
      const user = provider.wallet.publicKey;
      const id = parseInt(questId);

      const [daoConfigPda] = await PublicKey.findProgramAddressSync(
        [Buffer.from("dao_config")],
        program.programId
      );

      const [questionPda] = await PublicKey.findProgramAddressSync(
        [Buffer.from("question"), new BN(id).toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [voteRecordPda] = await PublicKey.findProgramAddressSync(
        [
          Buffer.from("vote_record"),
          user.toBuffer(),
          new BN(id).toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const daoConfig = await program.account.daoConfig.fetch(daoConfigPda);
      const rewardMint = daoConfig.rewardMint;

      const ata = PublicKey.findProgramAddressSync(
        [
          user.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          rewardMint.toBuffer(),
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
      );


      await program.methods
        .claimReward(new BN(id))
        .accounts({
          user,
          daoConfig: daoConfigPda,
          question: questionPda,
          voteRecord: voteRecordPda,
          tokenMint: rewardMint,
          userTokenAccount: ata[0],
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      toast({
        title: "Success",
        description: "Reward claimed successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Claim Reward Error:", err);
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8}>
      <Heading mb={4}>Claim Phần Thưởng</Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Nhập quest ID"
          value={questId}
          onChange={(e) => setQuestId(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleClaim}>
          Claim Reward
        </Button>
      </VStack>
    </Box>
  );
};

export default ClaimReward;
