import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Button, Heading, Text, Spinner, Alert, AlertIcon, VStack } from "@chakra-ui/react";

let accountAddress = "";

function LoginPage() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hàm kết nối Phantom Wallet
  const connectWallet = async () => {
    setError("");
    setIsConnecting(true);

    try {
      const provider = window.solana;
      if (!provider || !provider.isPhantom) {
        setError("Vui lòng cài đặt Phantom Wallet để tiếp tục.");
        return;
      }

      const resp = await provider.connect();
      setCurrentAccount(resp.publicKey.toString());
      accountAddress = resp.publicKey.toString();
    } catch (err) {
      console.error("Lỗi khi kết nối Phantom:", err);
      setError("Không thể kết nối với Phantom Wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Lắng nghe thay đổi tài khoản Phantom
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
      setError("Bạn đã ngắt kết nối ví.");
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
            Trang Đăng Nhập
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
                Kết Nối Ví Phantom
              </Button>
            ) : (
              <Box>
                <Text mb={4} fontSize="md">
                  Địa chỉ ví: {currentAccount}
                </Text>
                <Button colorScheme="teal" onClick={() => navigate("/dashboard")} width="100%">
                  Đi tới Trang Dashboard
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
