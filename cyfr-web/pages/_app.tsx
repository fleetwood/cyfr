import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useRef } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const qc = useRef(new QueryClient());

  return (
    <QueryClientProvider client={qc.current}>
      <Hydrate state={pageProps.dehydratedState}>
          <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
