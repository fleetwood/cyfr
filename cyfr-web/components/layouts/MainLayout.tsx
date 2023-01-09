import { ReactNode } from "react";
import Section from "../ui/section";
import Footer from "../containers/Footer";
import Navbar from "../containers/Navbar";
import { __prod__ } from "../../utils/constants";
import RightColumn from "../containers/RightColumn";
import LeftColumn from "../containers/LeftColumn";

type MainLayoutProps = {
  sectionTitle: string;
  pageTitle?: string;
  subTitle?: string;
  children?: ReactNode;
};

const MainLayout = ({ sectionTitle, subTitle, children }: MainLayoutProps) => {
  return (

    <div className="grad-1">
    <div className="grad-2">
      <div className="grad-3">
        <div className="grad-4">
    <div className="w-full min-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
      <div className="w-fixed w-full flex-shrink flex-grow-0">
        <LeftColumn />
      </div>
      <main role="main" className="w-full h-screen flex-grow m-0 overflow-auto">
        <Navbar className="min-w-full" />

        <Section
          className="box-border"
          sectionTitle={sectionTitle}
          subTitle={subTitle}
        >
          {children}
        </Section>
        <Footer />
      </main>
      <div className="w-fixed w-full flex-shrink flex-grow-0 px-2">
        <RightColumn />
      </div>

    </div>
    </div></div></div></div>
  );
};
export default MainLayout;
