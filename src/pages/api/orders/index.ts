import React, { useEffect, useState } from "react";
import { Box, Text, Heading, List, ListItem, Divider } from "@chakra-ui/react";
import { useUser } from "../context/userContext";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  // Add more order details as needed
}

const Profile: React.FC = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);

  return (
    <Box p={4}>
      <Heading as="h1" fontSize="2xl" mb={4}>
        My Profile
      </Heading>
      <Box bg="white" p={4} borderRadius="md" boxShadow="md">
        <Text mb={2}>
          <strong>Name:</strong> {user.firstName} {user.lastName}
        </Text>
        <Text mb={2}>
          <strong>Email:</strong> {user.email}
        </Text>
        {/* Add more user information fields as needed */}
      </Box>
      <Divider my={4} />
      <Heading as="h2" fontSize="xl" mb={2}>
        Order History
      </Heading>
      <List spacing={2}>
        {orders.map((order) => (
          <ListItem key={order.id}>
            <strong>Order Number:</strong> {order.orderNumber}
            <br />
            <strong>Date:</strong> {order.date}
            {/* Add more order details here */}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Profile;
