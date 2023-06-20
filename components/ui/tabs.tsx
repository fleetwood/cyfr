import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { uuid } from "utils/helpers";

const Tabs = ({variant = 'bar', children}: { variant?: 'bar' | 'buttons', children: any[] }) => {
    const [activeTab, setActiveTab] = useState(0)

    const listClass = variant === 
        'bar' ? 'space-x-4 bg-info-content p-1 rounded-lg flex flex-grow justify-evenly' 
        : 'border-b-8 border-secondary flex justify-between space-x-2'
    
    const selectedButton = (tab:number) => activeTab === tab ? `btn btn-secondary rounded-b-none mt-0` : `btn btn-primary -mt-1`

    const selectedBar = (tab:number) => `cursor-pointer hover:text-secondary transition-colors duration-300 ${activeTab === tab ? 'h-subtitle' : 'text-info'}`

    const items = Array.isArray(children) ? children : [...children]
 
    useEffect(() => {
        const tab = window.location.hash
        if (tab && tab.length > 0) {
        //   setActiveTab(tab)
        } else {
        //   debug('useEffect', {hash: `Ain't no hash ${window.location}`})
        }
      }, [])
      
  return (
    <Tab.Group vertical onChange={setActiveTab}>
        <Tab.List className={listClass}>
            {items.map((t,i) => (
            <Tab as={Fragment} key={`tab-${uuid()}`}>
                <div className={variant === 'bar' ? selectedBar(i) : selectedButton(i) }>{t.props.children[0]}</div>
            </Tab>
            ))}
        </Tab.List>

        <Tab.Panels>
            {items.map((p,i) => (
            <Tab.Panel>{p.props.children[1]}</Tab.Panel>
            ))}
        </Tab.Panels>
    </Tab.Group>
)}

export default Tabs