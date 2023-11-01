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
} from '@chakra-ui/react';
import { useUser } from '@/context/UserContext';

// Define your Order interface here...

const Profile: React.FC = () => {
  const { user, setUser } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const { colorMode } = useColorMode();

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // Simulated delay for loading state (remove in production)
    const delay = setTimeout(() => {
      setIsLoading(false);

      // Simulated error (remove in production)
      if (user) {
        setError('Failed to fetch orders. Please try again later.');
      } else {
        setError('User not logged in.');
      }
    }, 2000);

    // Cleanup the timeout to prevent memory leaks
    return () => clearTimeout(delay);
  }, [user]);

  const handleChangePassword = () => {
  
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
              <strong>Email:</strong> {user.email}
            </Text>
            <Button onClick={onOpen} colorScheme="blue" variant="outline" size="sm">
              Change Password
            </Button>
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
