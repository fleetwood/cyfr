import Link from 'next/link'
import React, { ReactNode } from 'react'
import { VariantProps } from 'types/props'

type LinkWithIconProps = {
    href?:      string
    className?: string
    onClick?:   (e?:any) => any
    spacing?:   number
    variant?:   VariantProps
    icon:       ReactNode
    label:      string
}

const LinkWithIcon = (props:LinkWithIconProps) => props.href 
    ? <Link href={props.href} className={`text-${props.variant??'primary'} flex space-x-${props.spacing??2} ${props.className}`} >{props.icon} <span>{props.label}</span></Link >
    : <div className={`cursor-pointer text-${props.variant??'primary'} flex space-x-${props.spacing??2} ${props.className}`} onClick={props.onClick} >{props.icon} <span>{props.label}</span></div>

export default LinkWithIcon