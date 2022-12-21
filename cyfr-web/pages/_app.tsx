import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query';
import { CyfrUserProvider } from '../components/context/CyfrUserProvider';
import { useRef } from 'react';


function MyApp({ Component, pageProps }: AppProps) {
  const qc = useRef(new QueryClient());

  return ( 
    <QueryClientProvider client={qc.current}>
      <CyfrUserProvider {...pageProps}>
        <Component {...pageProps} />
      </CyfrUserProvider>
    </QueryClientProvider>
  )
}

export default MyApp
