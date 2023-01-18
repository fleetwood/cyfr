import { Main } from "next/document";
import { ReactNode, useContext, useRef, useState } from "react";
import { log } from "../../utils/log";
import Footer from "../containers/Footer";
import LeftColumn from "../containers/LeftColumn";
import Navbar from "../containers/Navbar";
import RightColumn from "../containers/RightColumn";
import { ToastContext } from "../context/ToastContextProvider";
import Section from "../ui/section";

type MainLayoutProps = {
  sectionTitle: string | ReactNode
  pageTitle?: string | null
  subTitle?: string | null
  children?: ReactNode
};

const MainLayout = ({ sectionTitle, children, ...props }: MainLayoutProps) => {
  const [scrollActive, setScrollActive] = useState(false);
  const {toasts} = useContext(ToastContext)
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
            <div className="w-full min-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
              <div className="w-fixed w-full flex-shrink flex-grow-0">
                <LeftColumn />
              </div>
              <main
                role="main"
                className="w-full h-screen flex-grow m-0 overflow-auto scrollbar-hide"
                onScroll={handleScroll}
                ref={mainRef}
              >
                <Navbar className="min-w-full transition-all duration-200 ease-out" active={scrollActive} />

                <div className="toast toast-top toast-center w-4/6 mt-10 z-10">
                  {toasts.map((toast) => toast.toast)}
                </div>
                
                <Section
                  className="box-border snap-y"
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
    </div>
  );
};
export default MainLayout;
