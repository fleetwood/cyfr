import { useState, useRef } from "react";
import Footer from "../components/containers/Footer";
import LeftColumn from "../components/containers/LeftColumn";
import Navbar from "../components/containers/Navbar";
import RightColumn from "../components/containers/RightColumn";
import { useToast } from "../components/context/ToastContextProvider";
import { CyfrLogo } from "../components/ui/icons"
import Section from "../components/ui/section";
import sectionTitle from "../components/ui/sectionTitle";
import SectionTitle from "../components/ui/sectionTitle";
import Link from "next/link";
import { getApi, sendApi } from "../utils/api";
import JsonBlock from "../components/ui/jsonBlock";

const Dev = () => {
  const [scrollActive, setScrollActive] = useState(false);
  const { toasts } = useToast()
  const mainRef = useRef<HTMLElement>(null);
  const [data, setdata] = useState<any>({})
  const [current, setcurrent] = useState<string>()

  const handleScroll = (e: any) => {
    const position = mainRef?.current?.scrollTop;
    setScrollActive((current) => (position && position > 120) || false);
  };

  const get = async (url:string) => {
    setcurrent(() => url)
    const result = await getApi(url)
    if (result) {
      setdata(() => result)
    }
  }

  const send = async (url:string, body:any) => {
    setcurrent(() => url)
    const result = await sendApi(url, body)
    if (result) {
      setdata(() => result)
    }
  }

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

const GetLink = ({url, label}:{url:string, label: string}) =>(
  <div className={
    `font-mono cursor-pointer my-2 p-2 hover:bg-accent hover:bg-opacity-25
    ${current===url ? `bg-accent bg-opacity-50 text-accent-content` : ``}
    `}
    onClick={() => get(url)}>
    <span className="text-xs"> {current===url && (<span className="text-md">►</span>)} [GET] <span className="font-semibold underline text-primary text-sm">{label}</span> ({url})</span>
  </div>
)

const SendLink = ({url, label, body}:{url:string, label: string, body:any}) => ( 
  <div className={
    `font-mono cursor-pointer my-2 p-2 hover:bg-accent hover:bg-opacity-25
    ${current===url ? `bg-primary bg-opacity-50 text-primary-content` : ``}
    `}
    onClick={() => get(url)}>
    <span className="text-xs">[POST] <span className="font-semibold underline text-primary">{label}</span> ({url})</span>
  </div>
)
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

                <div className="toast toast-top toast-center w-4/6 mt-10 z-10">
                  {toasts.map((toast) => toast.toast)}
                </div>
                <div className="col-span-3 mx-auto py-8">
                  <h1 className="h-title">Dev</h1>
                </div>
                <div className="mx-auto min-h-max p-8 mr-10 mb-10 rounded-xl bg-base-100 grid grid-cols-3 space-x-4">
                  <div className="col-span-1 py-8 overflow-y-auto scrollbar-hide">
                    <h2 className="h-subtitle">API</h2>
                    
                    <div className="my-4 border-t-2 border-accent w-[100%]">
                      <h3 className="h-title">Feed</h3>
                      <ul>
                        <li><GetLink label="main" url="feed/main" /></li>
                      </ul>
                    </div>

                    <div className="my-4 border-t-2 border-accent w-[100%]">
                      <h3 className="h-title">Post</h3>
                      <ul>
                        <li><GetLink label="all" url="post/all" /></li>
                        <li><GetLink label="byId" url="post/cldldzsqi0001li0giycit65i" /></li>
                      </ul>
                    </div>

                    <div className="my-4 border-t-2 border-accent w-[100%]">
                      <h3 className="h-title">User</h3>
                      <ul>
                        <li><GetLink label="byEmail" url="user/byEmail/wizening@gmail.com" /></li>
                        <li><GetLink label="byId" url="user/byId/cldjgz3zo0000qn0h24j2uwjg" /></li>
                        <li><GetLink label="me" url="/me" /></li>
                      </ul>
                    </div>

                  </div>
                  <div className="col-span-2 py-8">
                    <h2 className="h-subtitle">DATA</h2>
                    <div className="pl-4 text-lg text-accent font-semibold">{current}</div>
                    {/* <JsonBlock data={data} /> */}
                    {data && <pre className="mx-4 p-4 bg-base-300 text-base-content">{JSON.stringify(data, null, 2)}</pre>}
                  </div>
                </div>
                <Footer />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dev
