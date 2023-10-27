import React from "react";
import { useRouter } from "next/router";
import { Input, Button, Box } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" mb="4">
      <Input
        variant="filled"
        size="lg"
        placeholder="Search..."
        rounded="full"
        maxW="xs"
      />

      <Button
        leftIcon={<SearchIcon />}
        fontSize={"sm"}
        fontWeight={500}
        variant={"outline"}
        rounded="full"
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
