import React, { useState } from "react";
import { useRouter } from "next/router";
import { Input, Button, Box } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push({
        pathname: "/products",
        query: { q: searchTerm },
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mb="4">
      <Input
        variant="filled"
        size="lg"
        placeholder="Search for watches..."
        rounded="full"
        maxW="xs"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        mr={2} // spacing between input and button
      />

      <Button
        onClick={handleSearch}
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
