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

const programId = new PublicKey("6LWu2MDNZyBkkJ2gr6KL2hPqkRmDUac6VNNuw4TCdKEX");

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

  const fetchUserRole = async () => {
    setLoadingRole(true);
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const provider = new AnchorProvider(connection, window.solana, {});
      const program = new Program(idl, programId, provider);

      const [voteRecordPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("vote-record"),
          new PublicKey(currentAccount).toBuffer(),
        ],
        program.programId
      );

      const voteRecord = await program.account.voteRecord.fetch(voteRecordPDA);
      setUserRole(voteRecord.choice === 1 ? "admin" : "voter");
    } catch (err) {
      console.warn("Vote record not found or failed to fetch:", err);
      setUserRole("voter"); 
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