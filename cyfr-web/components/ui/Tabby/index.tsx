import React, { ReactElement } from "react"
import { ReactNode, useEffect, useState } from "react"
import { Tab, TabList, Tabs } from "react-tabs"
import { log } from "../../../utils/log"

type TabButtonProps = {
  btn: String
  active: boolean
  onClick: Function
}

type TabbyProps = {
  defaultIndex?: number
  children: ReactNode
  invalidate: boolean
}

export const TabButton = ({ btn, onClick, active }: TabButtonProps) => (
  <button className={`w-full btn ${active ? "btn-secondary rounded-b-none" : "btn-primary -mt-1"}`} onClick={() => onClick(btn)}>
    {btn}
  </button>
)

const Tabby = ({defaultIndex = 0, invalidate=false, children }: TabbyProps) => {
  const [tabs, setTabs] = useState<string[]>([])
  const [panels, setPanels] = useState<ReactElement[]>([])
  const [activeBtn, setActiveBtn] = useState('')

  const addTab = (name: string) => {
    setTabs((t) => [...t, name])
  }

  const addPanel = (panel: any) => {
    setPanels((p) => [...p, panel])
  }

  const renderChildren = () => {
    setTabs(() => [])
    setPanels(() => [])
    React.Children.map(children, (child) => {
      // @ts-ignore
      if (child.props.title) {
        // @ts-ignore
        addTab(child.props.title)
      }
      addPanel(child)
    })
    setActiveBtn(b => tabs[defaultIndex])
  }

  useEffect(() => {
    renderChildren()
  }, [])

  useEffect(() => {
    log(`Tabby.useEffect() invalidate: ${invalidate}`)
    if (invalidate===true) {
      renderChildren()
    }
  }, [invalidate])

  return (
    <Tabs defaultIndex={defaultIndex||0} >
      <TabList className="flex justify-between w-full space-x-2">
        {tabs.map((t,i) => (
          <Tab className="w-full">
            <TabButton btn={t} active={activeBtn ? activeBtn == t : i=== defaultIndex } onClick={setActiveBtn} />
          </Tab>
        ))}
      </TabList>
      <div className="border-t-4 border-secondary">{panels}</div>
    </Tabs>
  )
}

export default Tabby
