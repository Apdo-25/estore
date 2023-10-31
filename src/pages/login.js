import React from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  return (
    <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
      <Stack align={"center"}>
        <Heading fontSize={"4xl"}>Sign in to your account</Heading>
      </Stack>
      <Box
        rounded={"lg"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"lg"}
        p={8}
      >
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" />
          </FormControl>
          <Stack spacing={10}>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            >
              <Checkbox>Remember me</Checkbox>
              <Link href={"#"} color="blue.400">
                Forgot password?
              </Link>
            </Stack>
            <Button
              bg={"blue.400"}
              size={"lg"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Sign in
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={"center"}>
              Dont have an Account?
              <Link href="/register" color={"blue.400"}>
                Register
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Login;
