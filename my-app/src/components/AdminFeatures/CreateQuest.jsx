import React, { useState } from "react";
import { 
  Input, 
  Button, 
  VStack, 
  useToast, 
  Heading, 
  Box, 
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  IconButton,
  Divider,
  Select,
  Badge
} from "@chakra-ui/react";
import { AddIcon, CloseIcon, StarIcon } from "@chakra-ui/icons";
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import NewsQuestProgram from "../../utils/NewsQuestProgram";
import { accountAddress } from "../../pages/LoginPage";

import { fetchNewsPolls } from "../../../../backend/getData.ts";

const CreateQuest = () => {
  const [title, setTitle] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [choices, setChoices] = useState(["", ""]);
  const [deadline, setDeadline] = useState("");
  const [rewardPerVote, setRewardPerVote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [newsPolls, setNewsPolls] = useState([]);
  const [selectedPoll, setSelectedPoll] = useState("");
  const toast = useToast();

  // Lấy wallet address từ LoginPage
  const getWalletAddress = () => {
    return accountAddress || '';
  };

  // Fetch news polls từ API
  const fetchAndSetNewsPolls = async () => {
    const data = await fetchNewsPolls();
    setIsLoadingAI(true);
    try {
      setNewsPolls(data);
      toast({
        title: "Success",
        description: `Loaded ${data.length} AI-generated polls`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching news polls:", error);
      toast({
        title: "Error",
        description: "Failed to fetch AI suggestions",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Áp dụng poll được chọn
  const applySelectedPoll = () => {
    if (!selectedPoll) return;
    
    const poll = newsPolls.find(p => p.title === selectedPoll);
    if (poll) {
      setTitle(poll.title);
      setImageUri("https://via.placeholder.com/400x200?text=News+Quest");
      setChoices(poll.choices);
      // Set deadline to 7 days from now
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      setDeadline(futureDate.toISOString().slice(0, 16));
      setRewardPerVote("10");
      
      toast({
        title: "Applied",
        description: "AI suggestion applied to form",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const addChoice = () => {
    if (choices.length < 10) {
      setChoices([...choices, ""]);
    }
  };

  const removeChoice = (index) => {
    if (choices.length > 2) {
      const newChoices = choices.filter((_, i) => i !== index);
      setChoices(newChoices);
    }
  };

  const updateChoice = (index, value) => {
    const newChoices = [...choices];
    newChoices[index] = value;
    setChoices(newChoices);
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!imageUri.trim()) {
      toast({
        title: "Error",
        description: "Please enter an image URI",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (choices.some(choice => !choice.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all choices",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!deadline) {
      toast({
        title: "Error",
        description: "Please set a deadline",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    if (!rewardPerVote || rewardPerVote <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid reward amount",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const handleCreateQuest = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const walletAddress = getWalletAddress();

    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Kết nối với Solana
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      
      // Lấy provider từ Phantom wallet
      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        throw new Error("Please install Phantom wallet");
      }

      // Kết nối wallet nếu chưa kết nối
      if (!provider.isConnected) {
        await provider.connect();
      }

      // Tạo wallet adapter cho Anchor
      const wallet = {
        publicKey: provider.publicKey,
        signTransaction: async (transaction) => {
          return await provider.signTransaction(transaction);
        },
        signAllTransactions: async (transactions) => {
          return await provider.signAllTransactions(transactions);
        },
      };

      // Tạo Anchor provider
      const anchorProvider = new anchor.AnchorProvider(
        connection,
        wallet,
        { commitment: "confirmed" }
      );

      // Tạo NewsQuest program instance
      const newsQuestProgram = new NewsQuestProgram(anchorProvider);
      
      console.log("NewsQuest Program:", newsQuestProgram);
      
      // Lấy question ID từ dao_config
      const questionId = await newsQuestProgram.getTotalQuestions();
      console.log("Question ID:", questionId);
      
      // Tạo transaction
      const transaction = await newsQuestProgram.createQuest(
        questionId,
        title,
        imageUri,
        choices,
        Math.floor(new Date(deadline).getTime() / 1000),
        parseInt(rewardPerVote)
      );

      console.log("Transaction:", transaction);
      
      // Gửi transaction
      const signature = await anchorProvider.sendAndConfirm(transaction);
      
      console.log("Transaction signature:", signature);

      toast({
        title: "Success",
        description: `Quest created successfully! Transaction: ${signature}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setTitle("");
      setImageUri("");
      setChoices(["", ""]);
      setDeadline("");
      setRewardPerVote("");

    } catch (error) {
      console.error("Error creating quest:", error);
      toast({
        title: "Error",
        description: `Failed to create quest: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Heading size="lg" mb={6} color="teal.500">
        Create New Quest
      </Heading>
      
      {/* AI Suggestions Section */}
      <Box mb={6} p={4} border="1px" borderColor="gray.200" borderRadius="md">
        <HStack justify="space-between" mb={4}>
          <Heading size="md" color="purple.500">
            <StarIcon mr={2} />
            AI Suggestions From News
          </Heading>
          <Button
            onClick={fetchAndSetNewsPolls}
            isLoading={isLoadingAI}
            loadingText="Loading AI..."
            colorScheme="purple"
            size="sm"
          >
            Generate
          </Button>
        </HStack>

        {newsPolls.length > 0 && (
          <VStack spacing={3} align="stretch">
            <FormControl>
              <FormLabel>Select AI-Generated Poll</FormLabel>
              <Select
                placeholder="Choose a poll to apply"
                value={selectedPoll}
                onChange={(e) => setSelectedPoll(e.target.value)}
              >
                {newsPolls.map((poll, index) => (
                  <option key={index} value={poll.title}>
                    {poll.title}
                  </option>
                ))}
              </Select>
            </FormControl>

            {selectedPoll && (
              <Box p={3} bg="purple.50" borderRadius="md">
                <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Selected Poll:
                </Text>
                <Text fontSize="sm" mb={2}>
                  <strong>Question:</strong> {newsPolls.find(p => p.title === selectedPoll)?.question}
                </Text>
                <Text fontSize="sm" mb={2}>
                  <strong>Choices:</strong>
                </Text>
                <HStack flexWrap="wrap" spacing={1}>
                  {newsPolls.find(p => p.title === selectedPoll)?.choices.map((choice, idx) => (
                    <Badge key={idx} colorScheme="purple" variant="subtle">
                      {choice}
                    </Badge>
                  ))}
                </HStack>
                <Button
                  onClick={applySelectedPoll}
                  colorScheme="purple"
                  size="sm"
                  mt={2}
                >
                  Apply to Form
                </Button>
              </Box>
            )}
          </VStack>
        )}
      </Box>

      <Divider mb={6} />
      
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Quest Title</FormLabel>
          <Input
            placeholder="Enter quest title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={128}
          />
          <FormHelperText>Maximum 128 characters</FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Image URI</FormLabel>
          <Input
            placeholder="https://example.com/image.png"
            value={imageUri}
            onChange={(e) => setImageUri(e.target.value)}
            maxLength={256}
          />
          <FormHelperText>URL to quest image (max 256 characters)</FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Choices</FormLabel>
          <VStack spacing={2} align="stretch">
            {choices.map((choice, index) => (
              <HStack key={index}>
                <Input
                  placeholder={`Choice ${index + 1}`}
                  value={choice}
                  onChange={(e) => updateChoice(index, e.target.value)}
                  maxLength={128}
                />
                {choices.length > 2 && (
                  <IconButton
                    icon={<CloseIcon />}
                    onClick={() => removeChoice(index)}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                  />
                )}
              </HStack>
            ))}
            {choices.length < 10 && (
              <Button
                leftIcon={<AddIcon />}
                onClick={addChoice}
                size="sm"
                variant="outline"
                colorScheme="teal"
              >
                Add Choice
              </Button>
            )}
          </VStack>
          <FormHelperText>
            Minimum 2 choices, maximum 10 choices
          </FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Deadline</FormLabel>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <FormHelperText>When the quest will end</FormHelperText>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Reward per Vote</FormLabel>
          <NumberInput
            value={rewardPerVote}
            onChange={(value) => setRewardPerVote(value)}
            min={1}
          >
            <NumberInputField placeholder="Enter reward amount" />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>Amount of tokens rewarded per vote</FormHelperText>
        </FormControl>

        <Divider />

        <Button
          colorScheme="teal"
          onClick={handleCreateQuest}
          isLoading={isLoading}
          loadingText="Creating Quest..."
          size="lg"
          width="100%"
        >
          Create Quest
        </Button>
      </VStack>
    </Box>
  );
};

export default CreateQuest;