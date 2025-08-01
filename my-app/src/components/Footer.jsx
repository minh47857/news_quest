// src/components/Footer.jsx
import { Box, Text } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      bg="teal.500"
      color="white"
      textAlign="center"
      py={2} // Giảm chiều cao của footer
      fontSize="sm"
      borderTop="1px solid #e0e0e0"
    >
      <Text>
        &copy; 2025 AI Powered New Quests. Powered by  A-Squad
      </Text>
    </Box>
  );
}

export default Footer;