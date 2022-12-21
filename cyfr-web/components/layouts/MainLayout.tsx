import { ReactNode } from "react"
import LeftMenu from "../containers/LeftMenu"
import Section from "../ui/section"
import Footer from "../containers/Footer"
import Navbar from "../containers/Navbar"
import { __prod__ } from "../../utils/constants"

export enum Layouts {
  MAIN = "MAIN",
  LEFT_MENU = "LEFTMENU",
}

type MainLayoutProps = {
  sectionTitle: string
  pageTitle?: string
  subTitle?: string
  children?: ReactNode
  className?: string
}

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
      h-screen
      ${className}`
    }
    >

      <div className="col-span-2 flex flex-col h-screen">
        <LeftMenu />
      </div>

      <div className="col-span-8 flex flex-col h-screen justify-between">
        <Navbar className="min-w-full" />
        <Section className="min-w-full overflow-clip mb-auto" sectionTitle={sectionTitle} subTitle={subTitle}>
          {children}
        </Section>
        <Footer className="" />
      </div>
      
      <div className="col-span-2 mr-0 text-right flex flex-col h-screen"></div>
    </div>
  )
}
export default MainLayout
