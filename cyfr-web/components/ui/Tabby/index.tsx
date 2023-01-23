import React, { ReactElement } from "react"
import { ReactNode, useEffect, useState } from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

type TabButtonProps = {
  btn: String
  active: boolean
  onClick: Function
}

type TabbyProps = {
  defaultIndex?: number
  children: ReactNode
}

export const TabButton = ({ btn, onClick, active }: TabButtonProps) => (
  <button className={`w-full btn ${active ? "btn-secondary rounded-b-none" : "btn-primary -mt-1"}`} onClick={() => onClick(btn)}>
    {btn}
  </button>
)

const Tabby = ({defaultIndex, children }: TabbyProps) => {
  const [tabs, setTabs] = useState<string[]>([])
  const [panels, setPanels] = useState<ReactElement[]>([])
  const [activeBtn, setActiveBtn] = useState(tabs[0])

  const addTab = (name: string) => {
    setTabs((t) => [...t, name])
  }

  const addPanel = (panel: any) => {
    setPanels((p) => [...p, panel])
  }

  useEffect(() => {
    React.Children.map(children, (child) => {
      // @ts-ignore
      if (child.props.title) {
        // @ts-ignore
        addTab(child.props.title)
      }
      addPanel(child)
    })
  }, [])

  return (
    <Tabs defaultIndex={defaultIndex||0}>
      <TabList className="flex justify-between w-full space-x-2">
        {tabs.map((t) => (
          <Tab className="w-full">
            <TabButton btn={t} active={activeBtn == t} onClick={setActiveBtn} />
          </Tab>
        ))}
      </TabList>
      <div className="border-t-4 border-secondary">{panels}</div>
    </Tabs>
  )
}

export default Tabby
