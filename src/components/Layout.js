import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Box>
        <Header />
      </Box>

      <Flex flex="1" direction="column" justify="center" align="center">
        <Box flex="1" width="100%">
          {children}
        </Box>
      </Flex>

      <Box>
        <Footer />
      </Box>
    </Flex>
  );
};

export default Layout;
