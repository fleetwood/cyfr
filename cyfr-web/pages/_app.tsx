import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query';
import { CyfrUserProvider } from '../components/context/CyfrUserProvider';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {

  return ( 
    <QueryClientProvider client={queryClient}>
      <CyfrUserProvider {...pageProps}>
        <Component {...pageProps} />
      </CyfrUserProvider>
    </QueryClientProvider>
  )
}

export default MyApp
