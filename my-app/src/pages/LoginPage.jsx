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
  Input,
} from "@chakra-ui/react";

let accountAddress = "";

function LoginPage() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const [roleInput, setRoleInput] = useState(""); // input for user to enter role
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

  const checkUserRole = () => {
    if (roleInput === "0") {
      navigate("/voter");
    } else if (roleInput === "1") {
      navigate("/admin");
    } else {
      setError("Please enter 0 (voter) or 1 (admin).");
    }
  };

  useEffect(() => {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) return;

    const handleConnect = () => {
      setCurrentAccount(provider.publicKey.toString());
      accountAddress = provider.publicKey.toString();
    };

    const handleDisconnect = () => {
      setCurrentAccount(null);
      accountAddress = "";
      setError("You have disconnected your wallet.");
    };

    provider.on("connect", handleConnect);
    provider.on("disconnect", handleDisconnect);

    return () => {
      provider.off("connect", handleConnect);
      provider.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box as="main" flex="1" display="flex" alignItems="center" justifyContent="center" p={8} bg="gray.100">
        <Box bg="white" p={8} borderRadius="lg" boxShadow="lg" width="400px" textAlign="center">
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
              <Button colorScheme="teal" onClick={connectWallet} width="100%" isLoading={isConnecting}>
                Connect Phantom Wallet
              </Button>
            ) : (
              <Box width="100%">
                <Text mb={2} fontSize="md">
                  Wallet Address: {currentAccount}
                </Text>
                <Input
                  placeholder="Enter 0 (voter) or 1 (admin)"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  mb={2}
                />
                <Button colorScheme="teal" onClick={checkUserRole} width="100%">
                  Continue
                </Button>
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
