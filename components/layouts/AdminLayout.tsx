import { ReactNode, useRef, useState } from "react";
import Footer from "../containers/Footer";
import LeftColumn from "../containers/LeftColumn";
import { useToast } from "../context/ToastContextProvider";
import Section from "../ui/section";

type AdminLayoutProps = {
  sectionTitle: string | ReactNode;
  pageTitle?: string | null;
  subTitle?: string | null;
  children?: ReactNode;
};

const AdminLayout = ({
  sectionTitle,
  children,
  ...props
}: AdminLayoutProps) => {
    const { toasts } = useToast();

  return (
    <div className="bg-base text-base-content">
        <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
          <div className="w-fixed w-full flex-shrink flex-grow-0 bg-gradient-to-b from-primary to-black">
            <LeftColumn />
          </div>
          <main
            role="main"
            className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
          >
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
        </div>
        </div>
  );
};
export default AdminLayout;
