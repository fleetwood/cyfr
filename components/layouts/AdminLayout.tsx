import UserApi from 'prisma/useApi/user'
import { ReactNode, useEffect, useRef, useState } from 'react'
import Footer from '../containers/Footer'
import LeftColumn from '../containers/LeftColumn'
import Section from '../ui/section'
import Toasts from '../ui/toasts'
import ErrorPage from 'pages/404'
import Spinner from 'components/ui/spinner'
import useDebug from 'hooks/useDebug'

const {debug} = useDebug('AdminLayout', )

type AdminLayoutProps = {
  sectionTitle: string | ReactNode
  pageTitle?: string | null
  subTitle?: string | null
  children?: ReactNode
}

const AdminLayout = ({children, ...props}: AdminLayoutProps) => {
  const {canAccess} = UserApi()
  const [loading, setIsLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)
  const [rejected, setRejected] = useState(false)

  const [scrollActive, setScrollActive] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(() => position && position > 120 || false)
  }
  
  const getAccess = async () => {
    const access = true //await canAccess('OWNER')
    debug('getAccess', access)
    setAllowed(() => access)
    setRejected(() => !access)
    setIsLoading(() => false)
  }

  useEffect(() => {
    getAccess()
  }, [])

  return (
    <div className="bg-base text-base-content">
      <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
        <div className="w-fixed w-full flex-shrink flex-grow-0 bg-gradient-to-b from-primary to-black">
          <LeftColumn />
        </div>
        <main
          role="main"
          className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
          onScroll={handleScroll}
          ref={mainRef}
        >
          <Toasts />
          {loading && <Spinner />}
          {allowed &&
            <Section
              className="box-border snap-y min-h-full"
              sectionTitle={props.sectionTitle}
              subTitle={props.subTitle}
            >
              {children}
            </Section>
          }
          {rejected && <ErrorPage message='What you tryna do' />}
          <Footer />
        </main>
      </div>
    </div>
)}
export default AdminLayout
