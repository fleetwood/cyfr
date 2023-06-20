import { Tab } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { uuid } from "utils/helpers";

export type TabVariants = 'bar' | 'buttons'

type TabProps = {
    variant?:       TabVariants 
    classNames?:    TabClassNames
    children:       any[]
}

export type TabClassNames = {
    list:       string
    item:       string
    selected:   string
}

const Tabs = ({variant = 'bar', classNames, children}:TabProps) => {
    const [activeTab, setActiveTab] = useState(0)

    const barClasses:TabClassNames = {
        list: 'space-x-4 bg-info-content p-1 rounded-lg flex flex-grow justify-evenly',
        item: 'cursor-pointer hover:text-secondary transition-colors duration-300 text-info',
        selected: 'cursor-pointer hover:text-secondary transition-colors duration-300 h-subtitle'
    }

    const buttonsClasses:TabClassNames = {
        list: 'border-b-8 border-secondary flex space-x-2',
        item: `btn btn-primary grow -mt-1`,
        selected: `btn btn-secondary grow rounded-b-none mt-0`
    }

    const classes = classNames !== undefined ? classNames : variant === 'bar' ? barClasses : buttonsClasses
    
    const selected = (tab:number) => activeTab === tab ? classes.selected : classes.item

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
        <Tab.List className={classes.list}>
            {items.map((t,i) => (
            <Tab key={`tab-${uuid()}`} className={selected(i)}>
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