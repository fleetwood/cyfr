// Tabs.tsx
import React, {
  Children, isValidElement, ReactNode,
  useEffect, useState
} from "react"
import { log } from "../../../utils/log"
import Tab from './Tab'
import TabContent from "./TabContent"

interface TypeProps {
  type: string
  key?: string
  props?: any
}

export type TabsProps = {
children?: ReactNode
className?: string
}

const Tabs = ({className, children, ...props }:TabsProps) => {
    const [activeTab, setActiveTab] = useState<string>()
    const [tabs, setTabs] = useState<Array<typeof Tab>>([])
    const [contents, setContents] = useState<Array<typeof TabContent>>([])

    const handleOnClick = (forSection:string) => {
      log(`handleOnClick ${forSection}`)
      setActiveTab(forSection)
    }

    useEffect(() => {
      Children.map(children, child => {
        if (typeof child === typeof Tab) {
          log('found goddamn tab')
        }
      })
    }, [])

    return <>
      {children}
    </>
}

export { Tabs, Tab, TabContent }
