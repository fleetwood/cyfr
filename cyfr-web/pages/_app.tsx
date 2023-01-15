import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import ToastProvider from './../components/context/ToastContextProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const qc = new QueryClient()

  return (
    <QueryClientProvider client={qc}>
      <Hydrate state={pageProps.dehydratedState}>
          <ToastProvider {...pageProps}>
            <Component {...pageProps} />
          </ToastProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
