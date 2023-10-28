import React from "react";
import {
  Stack,
  Flex,
  Button,
  Text,
  VStack,
  useBreakpointValue,
  Tooltip,
  Icon,
  Box,
  Heading,
  Image,
} from "@chakra-ui/react";

import { FaArrowRight } from "react-icons/fa";

import Link from "next/link";

const Hero = () => {
  return (
    <Flex
      align="center"
      justify={["center", "space-around", "space-between"]}
      direction={["column-reverse", "column-reverse", "row"]}
      wrap="nowrap"
      minH="70vh"
      px={8}
      mb={16}
    >
      <Stack
        spacing={4}
        w={["100%", "100%", "40%"]}
        align={["center", "center", "flex-start"]}
      >
        <Heading
          as="h1"
          size="xl"
          fontWeight="bold"
          textAlign={["center", "center", "left"]}
        >
          Discover Timeless Watches
        </Heading>
        <Heading
          as="h2"
          size="md"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign={["center", "center", "left"]}
        >
          Explore our exquisite collection of elegant watches.
        </Heading>
        <Tooltip label="Click me to start!" hasArrow>
          <Button
            colorScheme="gray"
            borderRadius="md"
            p={4}
            lineHeight={1}
            size="md"
            rightIcon={<Icon as={FaArrowRight} />}
          >
            <Link href={"/products"} passHref>
              Browse Our Watches
            </Link>
          </Button>
        </Tooltip>
      </Stack>
      <Box w={["100%", "60%", "50%"]} mb={[12, 0]}>
        <Image
          src="https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Watch image"
          rounded="1rem"
          shadow="2xl"
          objectFit="cover"
          boxSize="100%"
        />
      </Box>
    </Flex>
  );
};

export default Hero;
