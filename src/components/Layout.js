import React from "react";
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Box>
        <Header />
      </Box>

      <Flex flex="1" justify="center" align="center">
        {children}
      </Flex>

      <Box>
        <Footer />
      </Box>
    </Flex>
  );
};

export default Layout;
