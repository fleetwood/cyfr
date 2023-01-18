import React, { JSXElementConstructor, ReactComponentElement, ReactNode } from 'react'

type TabContentProps = {
    active?: boolean,
    children?: ReactNode
}

const TabContent:JSXElementConstructor<TabContentProps> = ({active, children}:TabContentProps) => {
  return (
    <div className={active ? 'inline-block':'hidden'} >{children}</div>
  )
}

export default TabContent