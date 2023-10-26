import { SimpleGrid } from "@chakra-ui/react";
import { Children, isValidElement, useMemo } from "react";

export const ProductGrid = (props) => {
  const columns = useMemo(() => {
    const count = Children.toArray(props.children).filter(
      isValidElement
    ).length;
    return {
      base: Math.min(2, count),
      md: Math.min(3, Math.ceil(count / 2)), // Display ceil(count/2) products per row on medium screens
      lg: Math.min(4, Math.ceil(count / 2)), // Display 2 products per row on large screens
      xl: Math.min(8, Math.ceil(count / 2)), // Display 2 products per row on extra-large screens
    };
  }, [props.children]);

  return (
    <SimpleGrid
      columns={columns}
      columnGap={{
        base: "4",
        md: "6",
      }}
      rowGap={{
        base: "8",
        md: "10",
      }}
      maxW="full" // Set a maximum width for the grid container
      mx="auto"
      px={{
        base: "4",
        md: "8",
        lg: "12",
      }}
      py={{
        base: "6",
        md: "8",
        lg: "12",
      }}
      {...props}
    />
  );
};
