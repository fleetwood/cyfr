import CreateCommentModal from 'components/containers/Comment/CreateCommentModal'
import {MuiArticleIcon,MuiNewspaperIcon,MuiReviewsIcon,MuiSchoolIcon} from 'components/ui/icons'
import {ReactNode,useRef} from 'react'
import {NavPage} from 'types/props'
import Footer from '../containers/Footer'
import LeftColumn from '../containers/LeftColumn'
import Navbar from '../containers/Navbar/Navbar'
import RightColumn from '../containers/RightColumn'
import {useToast} from '../context/ToastContextProvider'
import Toasts from '../ui/toasts'
import SecondaryNavBar from 'components/containers/Navbar/SecondaryNavBar'
import useUrlHash from 'hooks/useUrlHash'

type ArticleLayoutProps = {
  children?: ReactNode,
  hash?:     string
}

const ArticleLayout = ({
  children,
  ...props
}: ArticleLayoutProps) => {
  const { toasts } = useToast()
  const articleRef = useRef<HTMLElement>(null)

  const pages:NavPage[] = [
    { label: 'All', url: '#all', icon: <MuiArticleIcon /> },
    { label: 'News', url: '#news', icon: <MuiNewspaperIcon /> },
    { label: 'Reviews', url: '#reviews', icon: <MuiReviewsIcon /> },
    { label: 'Learn', url: '#learn', icon: <MuiSchoolIcon /> },
  ]

  const selected = pages.findIndex(p => p.label.toLowerCase() === props.hash)

  return (
    <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
      <div className="w-fixed w-full flex-shrink flex-grow-0 bg-gradient-to-b from-secondary to-neutral">
        <LeftColumn variant='secondary' />
      </div>
      <div className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative">
        <Navbar variant='secondary' className="min-w-full transition-all duration-200 ease-out" />
        <Toasts />
        <div className="min-h-full">
          <SecondaryNavBar pages={pages} selected={selected} variant='primary' />
          <div className='p-4'>
            {children}
          </div>
        </div>
        <Footer />
      </div>
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
        <RightColumn />
      </div>
      <CreateCommentModal />
    </div>
  )
}
export default ArticleLayout
