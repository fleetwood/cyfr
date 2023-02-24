import { ReactNode, useRef, useState } from "react"
import Footer from "../containers/Footer"
import LeftColumn from "../containers/LeftColumn"
import Navbar from "../containers/Navbar"
import CreatePost from "../containers/Post/CreatePost"
import RightColumn from "../containers/RightColumn"
import SendMessageModal from "../containers/Comment/SendMessageModal"
import { useToast } from "../context/ToastContextProvider"
import Section from "../ui/section"

type MainLayoutProps = {
  sectionTitle: string | ReactNode
  pageTitle?: string | null
  subTitle?: string | null
  children?: ReactNode
}

const MainLayout = ({ sectionTitle, children, ...props }: MainLayoutProps) => {
  const createPostModal = 'createPostModal'
  const onCreate = () => {
    const createModal = document.getElementById(createPostModal)
    // @ts-ignore
    createModal!.checked = false
  }

  const [scrollActive, setScrollActive] = useState(false)
  const {toasts} = useToast()
  const mainRef = useRef<HTMLElement>(null)

  const handleScroll = (e:any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive(current => position && position > 120 || false)
  }

  return (
    <div className="grad-1">
      <div className="grad-2">
        <div className="grad-3">
          <div className="grad-4">
            <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
              <div className="w-fixed w-full flex-shrink flex-grow-0">
                <LeftColumn />
              </div>
              <main
                role="main"
                className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
                onScroll={handleScroll}
                ref={mainRef}
              >
                <Navbar className="min-w-full transition-all duration-200 ease-out" pageScrolled={scrollActive} />

                <div className="toast toast-top toast-center w-4/6 mt-10 z-10">
                  {toasts.map((toast) => toast.toast)}
                </div>
                <Section
                  className="box-border snap-y min-h-full"
                  sectionTitle={sectionTitle}
                  subTitle={props.subTitle}
                >
                  {children}
                </Section>
                <Footer />
              </main>
              <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
                <RightColumn />
              </div>
            </div>
          </div>
        </div>
      </div>

      <input type="checkbox" id={createPostModal} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-opacity-0 shadow-none overflow-visible scrollbar-hide">
          <label htmlFor={createPostModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <CreatePost onCreate={onCreate} />
        </div>
      </div>
      
    </div>
  )
}
export default MainLayout
