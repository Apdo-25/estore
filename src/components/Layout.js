import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Flex minH="100vh" direction="column" mx="auto">
      <Box>
        <Header />
      </Box>

      <Box flex="1" p={4}>
        {children}
      </Box>

      <Box>
        <Footer />
      </Box>
    </Flex>
  );
};

export default Layout;
