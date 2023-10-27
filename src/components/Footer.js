import React from "react";
import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import Link from "next/link";

const Logo = (props) => {
  return (
    <Link href="/" passHref>
      <Text
        fontFamily={"heading"}
        fontSize="lg"
        fontWeight="bold"
        letterSpacing="tight"
      >
        EStore
      </Text>
    </Link>
  );
};
const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("gray.100", "gray.700")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("gray.200", "gray.600"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const Footer = () => {
  return (
    <Box
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.700", "gray.200")}
    >
      <Container maxW={"6xl"} py={4}>
        <Stack
          direction={"row"}
          spacing={6}
          justify={"space-between"}
          align={"center"}
        >
          <Logo />
          <Stack direction={"row"} spacing={6}>
            <Box as="a" href={"/"}>
              Home
            </Box>
            <Box as="a" href={"#"}>
              About
            </Box>
            <Box as="a" href={"#"}>
              Products
            </Box>
            <Box as="a" href={"#"}>
              Contact
            </Box>
          </Stack>
        </Stack>
        <Box
          borderTopWidth={1}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          mt={4}
          pt={4}
        >
          <Stack
            direction={"row"}
            spacing={6}
            justify={"space-between"}
            align={"center"}
          >
            <Text>© 2023 EStore. All rights reserved</Text>
            <Stack direction={"row"} spacing={3}>
              <SocialButton label={"Twitter"} href={"#"}>
                <FaTwitter />
              </SocialButton>
              <SocialButton label={"YouTube"} href={"#"}>
                <FaYoutube />
              </SocialButton>
              <SocialButton label={"Instagram"} href={"#"}>
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
