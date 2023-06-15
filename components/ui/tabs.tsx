import { Tab } from "@headlessui/react";
import { Fragment, ReactFragment, ReactNode, useState } from "react";
import { uuid } from "utils/helpers";

const Tabs = (props: { children: any[] }) => {
    const [activeTab, setActiveTab] = useState(0)
    const selected = (tab:number) => `cursor-pointer hover:text-secondary transition-colors duration-300 ${activeTab === tab ? 'h-subtitle' : 'text-info'}`

    const items = Array.isArray(props.children) ? props.children : [...props.children]
 
  return (
    <Tab.Group vertical onChange={setActiveTab}>
        <Tab.List className='space-x-4 bg-info-content p-1 rounded-lg flex flex-grow justify-evenly'>
            {items.map((t,i) => (
            <Tab as={Fragment} key={`tab-${uuid()}`}>
                <div className={selected(i)}>{t.props.children[0]}</div>
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