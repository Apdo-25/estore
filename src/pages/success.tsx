import { Box, Heading, Text, Button, VStack, useColorModeValue } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { NextPage } from 'next';
import { useCart } from '@/context/CartContext';
import {useEffect} from "react"
import { useRouter } from 'next/router';


const Success: NextPage = () => {
const { clearCart } = useCart();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');
    const router = useRouter();

  useEffect(() => {
   
    if (router.query.payment === 'success') {
      clearCart();
    }
  }, [router, clearCart]);

  return (
    <Box>
    <VStack
      spacing={4}
      justifyContent="center"
      alignItems="center"
      height="80vh"
      bg={bgColor}
    >
      <CheckCircleIcon boxSize={12} color="green.500" />
      <Heading as="h1">Payment Successful!</Heading>
      <Text color={textColor} px={6} textAlign="center">
        Your payment has been processed successfully. 
        Thank you for your purchase.
      </Text>
      <Link href="/" passHref>
        <Button colorScheme="green" >Go to Homepage</Button>
      </Link>
    </VStack>
    </Box>
  );
};

export default Success;
