import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import {ClerkProvider} from '@clerk/nextjs'
import CyfrUserProvider from "../components/context/CyfrUserProvider";
import "../styles/globals.css";
import ToastProvider from "./../components/context/ToastContextProvider";

function MyApp({ Component, pageProps }:AppProps) {
  const qc = new QueryClient();

  return (
    <QueryClientProvider client={qc}>
      <Hydrate state={pageProps.dehydratedState}>
        <ClerkProvider>
          <ToastProvider {...pageProps}>
            <CyfrUserProvider {...pageProps}>
              <Component {...pageProps} />
            </CyfrUserProvider>
          </ToastProvider>
        </ClerkProvider>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
