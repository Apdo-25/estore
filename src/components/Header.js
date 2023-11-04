import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  VStack,
} from "@chakra-ui/react";
import {
  MoonIcon,
  SunIcon,
  HamburgerIcon,
  CloseIcon,
  AtSignIcon,
} from "@chakra-ui/icons";
import { CartIcon } from "./CartIcon";
import Link from "next/link";
import { FiUser } from "react-icons/fi";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { user, logout } = useUser(); // Extract user and logout function from UserContext
  const router = useRouter();
  const bg = useColorModeValue("white", "gray.800");
  const color = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.900");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    logout();
    router.push("/login"); // Redirect to login page after logout
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  if (!isClient) {
    return null; // or a placeholder if you prefer
  }

  return (
    <Box>
      <Flex
        bg={bg}
        color={color}
        minH={"80px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={borderColor}
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

        <Link href={"/Product/AllProducts"}>
          <Text
            fontSize={"m"}
            fontWeight={600}
            as={"a"}
            onClick={closeMobileMenu}
          >
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

          {/* Render "Account" button when user is logged in, otherwise render "Sign in" button */}
          {user ? (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Account"
                icon={<Icon as={FiUser} />}
                variant="ghost"
              />
              <MenuList>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                <Link href="/Profile">
                  <MenuItem>Profile</MenuItem>
                </Link>
              </MenuList>
            </Menu>
          ) : (
            <Link href={"/login"} passHref>
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
          )}

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
          <ModalContent mt={0} mb={0} ml={0} rounded="none" bg={bg}>
            <ModalCloseButton />
            <VStack p={4} spacing={4} align="start" w="100%">
              <Link href="/cart" onClick={closeMobileMenu} passHref>
                <Button
                  variant="ghost"
                  leftIcon={<CartIcon />}
                  rounded="full"
                  iconSpacing={2}
                />
              </Link>
              {/* Render "Account" button when user is logged in, otherwise render "Sign in" button */}
              {user ? (
                <Menu>
                  <MenuButton
                    as={Button} // Change this to Button
                    leftIcon={<Icon as={FiUser} />}
                    variant="ghost"
                  >
                    {/* Account */}
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => logout()}>Log Out</MenuItem>
                    <Link href="/Profile">
                      <MenuItem>Profile</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>
              ) : (
                <Link href="/login" onClick={closeMobileMenu} passHref>
                  <Button
                    variant="ghost"
                    leftIcon={<Icon as={FiUser} />}
                    w="100%"
                    justifyContent="flex-start"
                  >
                    Sign in
                  </Button>
                </Link>
              )}

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
