import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { CartProvider } from "../context/CartContext";
import { UserProvider } from "@/context/UserContext";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <CartProvider>
          <UserProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </UserProvider>
        </CartProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
