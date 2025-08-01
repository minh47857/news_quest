import React, { useState } from "react";
import {
  Input,
  Button,
  VStack,
  useToast,
  Heading,
  Box,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import  voteForQuestion  from "../../utils/voteForQuestion";
import { accountAddress } from "../../pages/LoginPage";
import BN from "bn.js";

const VoteQuestion = () => {
  const [questionId, setQuestionId] = useState("");
  const [choice, setChoice] = useState("");
  const toast = useToast();

  const handleVote = async () => {
    try {
      const txId = await voteForQuestion(parseInt(questionId), parseInt(choice));
      toast({
        title: "Vote thành công!",
        description: `Tx ID: ${txId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Vote thất bại!",
        description: err.message || "Lỗi không xác định.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Vote for Question</Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Nhập ID câu hỏi"
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
        />
        <Input
          placeholder="Nhập lựa chọn (0 hoặc 1)"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleVote}>
          Vote
        </Button>
      </VStack>
    </Box>
  );
};

export default VoteQuestion;
