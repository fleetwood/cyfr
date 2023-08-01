import { Tab } from "@headlessui/react"
import useDebug from "hooks/useDebug"
import { Fragment, useEffect, useState } from "react"
import { uuid } from "utils/helpers"

const {debug} = useDebug('Tabs', )

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

    // const keys = items.map(i => `${uuid()}`)
 
    // useEffect(() => {
    //     const tab = window.location.hash.replace('#','')
    //     if (tab && tab.length > 0) {
    //         debug('useEffect tab', {tab, items: items.map(i => i.props.children[0])})
    //     } else {
    //     //   debug('useEffect', {hash: `Ain't no hash ${window.location}`})
    //     }
    //   }, [])
      
  return (
    <Tab.Group vertical onChange={setActiveTab}>
        <Tab.List className={classes.list}>
        {items.map((t,i) => (
            <Tab key={uuid()} className={selected(i)}>
                <>{t.props.children[0]}</>
            </Tab>
        ))}
        </Tab.List>

        <Tab.Panels>
        {items.map((p,i) => (
            <Tab.Panel key={uuid()}>{p.props.children[1]}</Tab.Panel>
        ))}
        </Tab.Panels>
    </Tab.Group>
)}

export default Tabs