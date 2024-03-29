import { ReactNode, useRef, useState } from "react";
import Footer from "../containers/Footer";
import LeftColumn from "../containers/LeftColumn";
import Navbar from "../containers/Navbar/Navbar";
import RightColumn from "../containers/RightColumn";
import { useToast } from "../context/ToastContextProvider";
import Section from "../ui/section";
import Toasts from "../ui/toasts";

type MainLayoutProps = {
  sectionTitle: string | ReactNode;
  pageTitle?: string | null;
  subTitle?: string | null;
  children?: ReactNode;
};

const MainLayout = ({ sectionTitle, children, ...props }: MainLayoutProps) => {
  const [scrollActive, setScrollActive] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const handleScroll = (e: any) => {
    const position = mainRef?.current?.scrollTop;
    setScrollActive((current) => (position && position > 120) || false);
  };

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
                <Navbar
                  className="min-w-full transition-all duration-200 ease-out"
                  pageScrolled={scrollActive}
                />
                <Toasts />

                <Section
                  className="box-border snap-y min-h-full"
                  sectionTitle={sectionTitle}
                  subTitle={props.subTitle}
                >
                  <div className="
                    mt-4 p-4 
                    bg-neutral-content
                    even:bg-opacity-90 odd:bg-opacity-100
                    rounded-2xl
                    snap-always snap-start
                    "
                  >
                    {children}
                  </div>
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
