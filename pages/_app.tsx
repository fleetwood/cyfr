import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Hydrate, QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import CyfrUserProvider from "../components/context/CyfrUserProvider"
import ToastProvider from "./../components/context/ToastContextProvider"
import {__prod__} from "utils/constants"

function MyApp({ Component, pageProps }:AppProps) {
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
      {!__prod__ &&
        <ReactQueryDevtools initialIsOpen={false} />
      }
    </QueryClientProvider>
  )
}

export default MyApp
