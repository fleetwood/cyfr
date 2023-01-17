import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import ToastProvider from './../components/context/ToastContextProvider'
import CyfrUserProvider from "../components/context/CyfrUserProvider";

function MyApp({ Component, pageProps }: AppProps) {
  const qc = new QueryClient()

  return (
    <QueryClientProvider client={qc}>
      <Hydrate state={pageProps.dehydratedState}>
          <ToastProvider {...pageProps}>
            <CyfrUserProvider {...pageProps}>
              <Component {...pageProps} />
            </CyfrUserProvider>
          </ToastProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
