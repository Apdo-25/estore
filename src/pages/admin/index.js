import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
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
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { useProducts } from "@/context/ProductContext";

export default function Admin() {
  const { user, logout } = useUser();
  const router = useRouter();
  const { fetchProducts, products, addProduct, error } = useProducts();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const toast = useToast();
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const textColor = { light: "gray.900", dark: "gray.50" };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast({
        description: "Access denied. Please log in as an admin.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    fetchProducts();
  }, [user, fetchProducts, router, toast]);

  const handleLogout = async () => {
    logout();
    router.push("/login");
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name.trim() || !price) {
      toast({
        description: "Please fill in all required fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      await addProduct({ name, price });
      toast({
        description: "Product added successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchProducts(); // Refresh the products list
      onClose(); // Close the modal
    } catch (error) {
      toast({
        description:
          error.message || "Failed to add the product. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Reusable Section Component for Header */}
      <SectionHeader
        title="Admin Panel"
        actionButton={{ label: "Logout", onClick: handleLogout }}
      />
      <SectionHeader
        title="Products"
        actionButton={{ label: "Add Product", onClick: onOpen }}
      />
      <SectionHeader title="Orders" />

      {/* Add Product Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="price">
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              width="full"
              mt={4}
              onClick={handleAddProduct}
              isLoading={loading}
            >
              Add Product
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

// Extracted Section Header Component for reuse
function SectionHeader({ title, actionButton }) {
  const { colorMode } = useColorMode();
  const bgColor = { light: "gray.50", dark: "gray.900" };
  const textColor = { light: "gray.900", dark: "gray.50" };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={4}
      bg={bgColor[colorMode]}
      color={textColor[colorMode]}
    >
      <Heading size="md">{title}</Heading>
      {actionButton && (
        <Button onClick={actionButton.onClick}>{actionButton.label}</Button>
      )}
    </Box>
  );
}
