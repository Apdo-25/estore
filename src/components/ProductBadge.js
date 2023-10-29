import { Badge } from "@chakra-ui/react";

const ProductBadge = ({ flag }) => {
  switch (flag) {
    case "new":
      return (
        <Badge colorScheme="green" position="absolute" top="4" left="4">
          New
        </Badge>
      );
    case "on-sale":
      return (
        <Badge colorScheme="red" position="absolute" top="4" left="4">
          Sale
        </Badge>
      );
    default:
      return null;
  }
};

export default ProductBadge;
