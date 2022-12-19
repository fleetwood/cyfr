import { ReactNode } from "react";
import LeftMenu from "../containers/LeftMenu";
import Section from "../ui/section";
import Footer from "../containers/Footer";
import Navbar from "../containers/Navbar";
import { __prod__ } from "../../utils/constants";

export enum Layouts {
  MAIN = "MAIN",
  LEFT_MENU = "LEFTMENU",
}

type MainLayoutProps = {
  sectionTitle: String;
  pageTitle?: String;
  subTitle?: String;
  children?: ReactNode;
  className?: String;
};

const MainLayout = ({
  sectionTitle,
  subTitle,
  children,
  className,
}: MainLayoutProps) => {

  return (
    <div className={`
      max-w-7xl mx-auto 
      grid grid-cols-12
      ${className}`
    }
    >

      <div className="col-span-2">
        <LeftMenu />
      </div>

      <div className="col-span-8">
        <Navbar className="" />
        <Section sectionTitle={sectionTitle} subTitle={subTitle}>
          {children}
        </Section>
        <Footer className="" />
      </div>
      
      <div className="col-span-2 mr-0 text-right"></div>
    </div>
  );
};
export default MainLayout;
