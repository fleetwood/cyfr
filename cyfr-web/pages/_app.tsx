import "../styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, Hydrate } from "react-query";
import {ReactQueryDevtools} from 'react-query/devtools'
import ToastProvider from './../components/context/ToastContextProvider'
import CyfrUserProvider from "../components/context/CyfrUserProvider";
import CommentProvider from "../components/context/CommentContextProvider";

function MyApp({ Component, pageProps }: AppProps) {
  const qc = new QueryClient()

  return (
    <QueryClientProvider client={qc}>
      <Hydrate state={pageProps.dehydratedState}>
          <ToastProvider {...pageProps}>
          <CyfrUserProvider {...pageProps}>
          <CommentProvider {...pageProps}>
              <Component {...pageProps} />
          </CommentProvider>
          </CyfrUserProvider>
          </ToastProvider>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;
