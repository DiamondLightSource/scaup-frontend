"use client";

import { store } from "@/store";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider, ColorModeScript, createStandaloneToast } from "@chakra-ui/react";
import { theme } from "@diamondlightsource/ui-components";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";

const { ToastContainer } = createStandaloneToast();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <SessionProvider basePath='/nextauth' refetchOnWindowFocus={false}>
        <Provider store={store}>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode='light' />
            <ToastContainer />
            {children}
          </ChakraProvider>
        </Provider>
      </SessionProvider>
    </CacheProvider>
  );
}
