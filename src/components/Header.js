import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Stack,
  VStack,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  SearchIcon,
  HamburgerIcon,
  CloseIcon,
} from "@chakra-ui/icons";

import { FiShoppingCart } from "react-icons/fi";

import Link from "next/link";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.800", "white")}
        minH={"80px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align="center"
        justify="space-between"
      >
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Link href={"/"}>
            <Text
              fontFamily={"heading"}
              fontSize="lg"
              fontWeight="bold"
              letterSpacing="tight"
            >
              EStore
            </Text>
          </Link>
        </Flex>
        <Link href={"products"}>
          <Text fontSize={"m"} fontWeight={600}>
            All Products
          </Text>
        </Link>

        {/* Mobile Menu Icon */}
        <Box display={{ base: "block", md: "none" }}>
          <IconButton
            icon={isMobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
            variant="ghost"
            onClick={toggleMobileMenu}
          />
        </Box>

        {/* Desktop Menu */}
        <Stack
          flex={{ base: 2, md: 1 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={4}
          align="center"
          display={{ base: "none", md: "flex" }}
        >
          {/* Search Bar */}
          <Input
            variant="filled"
            size="sm"
            placeholder="Search..."
            rounded="full"
            maxW="xs"
          />
          <Button
            leftIcon={<SearchIcon />}
            fontSize={"sm"}
            fontWeight={500}
            variant={"outline"}
            rounded="full"
          >
            Search
          </Button>

          {/* Other Menu Items */}
          <Link href={"/login"}>
            <Button
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"gray.600"}
              rounded="full"
            >
              Sign in
            </Button>
          </Link>

          <Link href="/cart">
            <Button leftIcon={<FiShoppingCart />}>Cart</Button>
          </Link>

          <Button
            onClick={toggleColorMode}
            fontSize={"sm"}
            variant={"ghost"}
            leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            rounded="full"
          >
            {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
        </Stack>
      </Flex>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <VStack p={2} spacing={2} align="flex-start">
          <Link href={"/login"}>
            <Button
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"gray.600"}
              rounded="full"
              w="100%"
              textAlign="left"
            >
              Sign in
            </Button>
          </Link>

          <Button
            onClick={toggleColorMode}
            fontSize={"sm"}
            variant={"ghost"}
            leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            rounded="full"
            w="100%"
            textAlign="left"
          >
            {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
        </VStack>
      )}
    </Box>
  );
};

export default Header;
