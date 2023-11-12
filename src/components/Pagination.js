"use client";
import { Flex, Text, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  return (
    <Flex align="center" justify="center" mt="8" gap="4">
      <IconButton
        icon={<ChevronLeftIcon />}
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        colorScheme="gray"
      />

      <Text fontSize="lg" fontWeight="bold">
        Page {currentPage} of {totalPages}
      </Text>

      <IconButton
        icon={<ChevronRightIcon />}
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        colorScheme="gray"
      />
    </Flex>
  );
};

export default Pagination;
