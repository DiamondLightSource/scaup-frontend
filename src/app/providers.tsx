"use client";

import { store } from "@/store";
import { customTheme } from "@/styles/theme";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript, createStandaloneToast } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

const { ToastContainer } = createStandaloneToast({ defaultOptions: { isClosable: true } });

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <SessionProvider basePath='/nextauth' refetchOnWindowFocus={false}>
        <Provider store={store}>
          <ChakraProvider
            theme={customTheme}
            toastOptions={{ defaultOptions: { isClosable: true } }}
          >
            <ColorModeScript initialColorMode='light' />
            <ToastContainer />
            {children}
          </ChakraProvider>
        </Provider>
      </SessionProvider>
    </CacheProvider>
  );
}
