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
  Slide,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Icon,
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  SearchIcon,
  HamburgerIcon,
  CloseIcon,
  AtSignIcon,
} from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { CartIcon } from "./CartIcon";

import Link from "next/link";
import { FiUser } from "react-icons/fi";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
              Timeless Watches
            </Text>
          </Link>
        </Flex>

        <Link href={"/Product/AllProducts"} onClick={closeMobileMenu}>
          <Text fontSize={"m"} fontWeight={600}>
            Browse Watches
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
          <Link href="/cart" passHref>
            <CartIcon />
          </Link>

          {/* Other Menu Items */}
          <Link href={"/login"}>
            <Button
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"gray.600"}
              rounded="full"
              icon={AtSignIcon}
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
          >
            {colorMode === "light" ? "Dark" : "Light"} Mode
          </Button>
        </Stack>
      </Flex>

      {/* Mobile Menu Content */}
      <Box display={{ base: "block", md: "none" }}>
        <Modal isOpen={isMobileMenuOpen} onClose={closeMobileMenu} size="full">
          <ModalOverlay />
          <ModalContent
            mt={0}
            mb={0}
            ml={0}
            rounded="none"
            bg={useColorModeValue("white", "gray.800")}
          >
            <ModalCloseButton />
            <VStack p={4} spacing={4} align="start" w="100%">
              <Link href="/cart" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  leftIcon={<CartIcon />}
                  rounded="full"
                  iconSpacing={2}
                />
              </Link>
              <Link href="/login" onClick={closeMobileMenu}>
                <Button
                  variant="ghost"
                  leftIcon={<Icon as={FiUser} />}
                  w="100%"
                  justifyContent="flex-start"
                >
                  Sign in
                </Button>
              </Link>
              <Button
                onClick={toggleColorMode}
                variant="ghost"
                leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                w="100%"
                justifyContent="flex-start"
              >
                {colorMode === "light" ? "Dark" : "Light"} Mode
              </Button>
            </VStack>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default Header;
