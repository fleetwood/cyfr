import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import CyfrUserProvider from "../components/context/CyfrUserProvider";
import ToastProvider from "./../components/context/ToastContextProvider"
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { __site__ } from "../utils/constants";

const client = new ApolloClient({
  uri: `${__site__}/api/graphql`,
  cache: new InMemoryCache()
})

// @ts-ignore
function MyApp({ Component, pageProps }) {
  const qc = new QueryClient();

  return (
    <ApolloProvider client={client}>
    <QueryClientProvider client={qc}>
      <Hydrate state={pageProps.dehydratedState}>
        <ToastProvider {...pageProps}>
          <CyfrUserProvider {...pageProps}>
            <Component {...pageProps} />
          </CyfrUserProvider>
        </ToastProvider>
      </Hydrate>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </ApolloProvider>
  );
}

export default MyApp;
