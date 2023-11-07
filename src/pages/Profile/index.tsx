import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  List,
  ListItem,
  Divider,
  Spinner,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useColorMode,
  Toast,
  useToast
} from '@chakra-ui/react';
import { useUser } from '@/context/UserContext';

type Order = {
  id: string;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
  }[];
};



const Profile: React.FC = () => {
  const { user, setUser } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { colorMode } = useColorMode();
  const toast = useToast();


  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(user.id)}`);
        if (!res.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data: Order[] = await res.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user) {
      return;
    }

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(user.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) {
        throw new Error('Failed to update password');
      }
  
      toast({
        title: 'Password updated',
        description: 'Your password has been updated.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setNewPassword('');
      setIsChangePasswordModalOpen(false);
      //close model
      onClose();


    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box p={4} bg={colorMode === 'light' ? 'white' : 'gray.800'} color={colorMode === 'light' ? 'gray.800' : 'white'}>
      <Heading as="h1" fontSize="2xl" mb={4}>
        My Profile
      </Heading>
      <Box p={4} borderRadius="md" boxShadow="md">
        {user ? (
          <>

            <Text mb={2}>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </Text>
            <Text mb={2}>
              <strong>Role:</strong> {user.role}
            </Text>
            <Text mb={2}>
              <strong>Email:</strong> {user.email}
            </Text>
            <Button onClick={onOpen} colorScheme="blue" variant="outline" size="sm"
              
            >
              Change Password
            </Button>

            <Button
              onClick={() => {
                setUser(null);
              }}
              colorScheme="red"
              variant="outline"
              size="sm"
              ml={2}
            >
              Logout
            </Button>

            {/* Change Password Modal */}
            <Modal isOpen={isChangePasswordModalOpen} onClose={() => setIsChangePasswordModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Change Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </FormControl>
                  <Button mt={4} colorScheme="blue" onClick={handleChangePassword}>
                    Save Password
                  </Button>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <Text color="red.500">User not logged in.</Text>
        )}
        {/* Add more user information fields as needed */}
      </Box>
      <Divider my={4} />
      <Heading as="h2" fontSize="xl" mb={2}>
        Order History
      </Heading>
      {isLoading ? (
        <Box display="flex" alignItems="center">
          <Spinner size="sm" mr={2} />
          <Text>Loading...</Text>
        </Box>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <List spacing={2}>
          {/* Render order history here */}
        </List>
      )}

      {/* Change Password Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormControl>
            <Button mt={4} colorScheme="blue" onClick={handleChangePassword}>
              Save Password
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile;
