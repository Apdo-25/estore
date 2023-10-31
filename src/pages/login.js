import React, { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../context/userContext";

const Login = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast({ description: "Please fill in all fields.", status: "warning" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setUser(data.user);
        toast({
          description: "Login successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          router.push("/");
        }, 3200);
      } else {
        toast({
          description: data.message || "Login failed.",
          status: "error",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        description: "Login failed. Please try again.",
        status: "error",
      });
    }
  };
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
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
              onClick={handleLogin}
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
