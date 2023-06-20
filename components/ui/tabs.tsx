import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { uuid } from "utils/helpers";

export type TabVariants = 'bar' | 'buttons'

type TabProps = {
    variant?: TabVariants 
    children: any[]
}

const Tabs = ({variant = 'bar', children}:TabProps) => {
    const [activeTab, setActiveTab] = useState(0)

    const barListClass =        'space-x-4 bg-info-content p-1 rounded-lg flex flex-grow justify-evenly'
    const barListItem =         'cursor-pointer hover:text-secondary transition-colors duration-300 text-info'
    const barListItemSelected = 'cursor-pointer hover:text-secondary transition-colors duration-300 h-subtitle'

    const buttonsListClass =        'border-b-8 border-secondary flex space-x-2'
    const buttonListItem =          `btn btn-primary grow -mt-1`
    const buttonListItemSelected =  `btn btn-secondary grow rounded-b-none mt-0`

    const listClass = variant === 'bar' ? barListClass : buttonsListClass
    
    const selectedButton = (tab:number) => activeTab === tab ? buttonListItemSelected : buttonListItem

    const selectedBar = (tab:number) => activeTab === tab ? barListItemSelected : barListItem

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
            <Tab key={`tab-${uuid()}`} className={variant === 'bar' ? selectedBar(i) : selectedButton(i) }>
                <>{t.props.children[0]}</>
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