import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Box,
  Button,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import idl from "../idl/news_quest.json";
import { Buffer } from "buffer";

const programId = new PublicKey("5Whv2g9gDJZnj9nsh2DFgQS9KQek7PZT4CJZeGxB1RxY");

let accountAddress = "";

function LoginPage() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [loadingRole, setLoadingRole] = useState(false);
  const [userRole, setUserRole] = useState(null); // "admin" | "voter" | null
  const navigate = useNavigate();

  const connectWallet = async () => {
    setError("");
    setIsConnecting(true);

    try {
      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        setError("Need to install Phantom Wallet.");
        return;
      }

      const resp = await provider.connect();
      const publicKey = resp.publicKey.toString();
      setCurrentAccount(publicKey);
      accountAddress = publicKey;
    } catch (err) {
      console.error("Error connecting to Phantom:", err);
      setError("Unable to connect to Phantom Wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  function deserializeDaoConfig(data) {
    let offset = 8; // Skip Anchor discriminator

    const admin = new PublicKey(data.slice(offset, offset + 32));
    offset += 32;

    const total_questions = data.readBigUInt64LE(offset);
    offset += 8;

    const reward_mint = new PublicKey(data.slice(offset, offset + 32));

    return {
      admin: admin.toBase58(),
      total_questions: Number(total_questions),
      reward_mint: reward_mint.toBase58(),
    };
  }

  async function getDaoConfig() {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    const [daoConfigPda] = await PublicKey.findProgramAddressSync(
      [Buffer.from("dao_config")],
      programId
    );

    const accountInfo = await connection.getAccountInfo(daoConfigPda);
    if (!accountInfo) throw new Error("DaoConfig not found");

    const daoConfig = deserializeDaoConfig(accountInfo.data);
    return daoConfig;
  }

  const fetchUserRole = async () => {
  setLoadingRole(true);
  try {
    const daoConfig = await getDaoConfig(); // dùng hàm thủ công của bạn
    console.log("Admin in daoConfig:", daoConfig.admin);

    if (daoConfig.admin === currentAccount) {
      setUserRole("admin");
    } else {
      setUserRole("voter");
    }
  } catch (err) {
    console.warn("Failed to fetch daoConfig:", err);
    setError("Failed to fetch user role.");
  } finally {
    setLoadingRole(false);
  }
};

  useEffect(() => {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) return;

    const handleConnect = () => {
      const pubKey = provider.publicKey.toString();
      setCurrentAccount(pubKey);
      accountAddress = pubKey;
    };

    const handleDisconnect = () => {
      setCurrentAccount(null);
      accountAddress = "";
      setUserRole(null);
      setError("You have disconnected your wallet.");
    };

    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);

    return () => {
      provider.off("connect", handleConnect);
      provider.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchUserRole();
    }
  }, [currentAccount]);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box
        as="main"
        flex="1"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
        bg="gray.100"
      >
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          width="400px"
          textAlign="center"
        >
          <Heading mb={6} color="teal.500">
            Login Page
          </Heading>
          <VStack spacing={4}>
            {error && (
              <Alert status="error" width="100%">
                <AlertIcon />
                {error}
              </Alert>
            )}
            {!currentAccount ? (
              <Button
                colorScheme="teal"
                onClick={connectWallet}
                width="100%"
                isLoading={isConnecting}
              >
                Connect Phantom Wallet
              </Button>
            ) : loadingRole ? (
              <Spinner />
            ) : (
              <Box width="100%">
                <Text mb={2} fontSize="md">
                  Wallet Address: {currentAccount}
                </Text>

                {userRole && (
                  <>
                    <Text mb={4} fontSize="lg" fontWeight="semibold">
                      Role: {userRole === "admin" ? "Admin" : "Voter"}
                    </Text>
                    <Button
                      colorScheme={userRole === "admin" ? "red" : "teal"}
                      width="100%"
                      onClick={() =>
                        navigate(userRole === "admin" ? "/admin" : "/voter")
                      }
                    >
                      {userRole === "admin"
                        ? "Go to Admin Dashboard"
                        : "Go to Voter Dashboard"}
                    </Button>
                  </>
                )}
              </Box>
            )}
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default LoginPage;
export { accountAddress };