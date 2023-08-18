import { ReactNode, useRef, useState } from 'react'
import Footer from '../containers/Footer'
import LeftColumn from '../containers/LeftColumn'
import Navbar from '../containers/Navbar/Navbar'
import CreatePostModal from '../containers/Post/CreatePostModal'
import RightColumn from '../containers/RightColumn'
import { useToast } from '../context/ToastContextProvider'
import Section from '../ui/section'
import Toasts from '../ui/toasts'
import CreateCommentModal from 'components/containers/Comment/CreateCommentModal'

type ArticleLayoutProps = {
  sectionTitle: string | ReactNode
  pageTitle?: string | null
  subTitle?: string | null
  children?: ReactNode
}

const ArticleLayout = ({
  sectionTitle,
  children,
  ...props
}: ArticleLayoutProps) => {
  const { toasts } = useToast()
  const articleRef = useRef<HTMLElement>(null)

  return (
    <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
      <div className="w-fixed w-full flex-shrink flex-grow-0 bg-gradient-to-b from-secondary to-neutral">
        <LeftColumn variant='secondary' />
      </div>
      <article
        role="article"
        className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
        ref={articleRef}
      >
        <Navbar variant='secondary' className="min-w-full transition-all duration-200 ease-out" />
        <Toasts />
        <Section
          className="box-border snap-y min-h-full"
          sectionTitle={sectionTitle}
          subTitle={props.subTitle}
        >
          {children}
        </Section>
        <Footer />
      </article>
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
        <RightColumn />
      </div>
      <CreateCommentModal />
    </div>
  )
}
export default ArticleLayout
