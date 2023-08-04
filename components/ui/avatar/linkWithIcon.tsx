import Link from 'next/link'
import React, { ReactNode } from 'react'
import { VariantProps } from 'types/props'

type LinkWithIconProps = {
    href:       string
    className?: string
    onClick?:   () => void
    spacing?:   number
    variant?:   VariantProps
    icon:       ReactNode
    label:      string
}

const LinkWithIcon = (props:LinkWithIconProps) => <Link href={props.href} className={`text-${props.variant??'primary'} flex space-x-${props.spacing??2}`} onClick={() => props.onClick??{}} >{props.icon} <span>{props.label}</span></Link >

export default LinkWithIcon