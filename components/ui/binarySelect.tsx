import { Box, Container, Grid, IconButton } from '@mui/material'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { MuiArrowLeftIcon } from './icons'
import {VariantProps} from 'types/props'


type BinaryValue = {
  label: string
  value?: any
  variant?: VariantProps
}
type BinarySelectorProps = {
    left:       BinaryValue
    right:      BinaryValue
    value?:     any
    setValue?:  (val:any) => any
    label?:     string
    className?: string
    spacing?:   number
    rounded?:   boolean
}

const BinarySelector = ({label, left, right, value, setValue, className, spacing= 1, rounded=false}:BinarySelectorProps) => {
  const [bg, setBg] = useState(`bg-${left.variant??'primary'}`)
  const p = `p-${spacing}`
  const [style, setStyle] = useState({ left: 0, width: 0 })
  const [pointLeft, setPointLeft] = useState(left.value === value ??false)
  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const middleRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const leftRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const rightRef: MutableRefObject<HTMLDivElement | null> = useRef(null)

  const toggle = (point?:boolean) => {
    const l = point ?? !pointLeft
    // @ts-ignore
    const rect = l === true ? leftRef.current.getBoundingClientRect() : middleRef.current.getBoundingClientRect()
    // @ts-ignore
    const x = rect.x - containerRef.current?.getBoundingClientRect().x
    // @ts-ignore
    const w = rect.width + (l === true ? middleRef.current?.getBoundingClientRect().width : rightRef.current?.getBoundingClientRect().width)
    setValue && setValue(() => (l === true ? left.value ?? true : right.value ?? false))
    setPointLeft(() => l)
    setBg(() => (`bg-`+ (l === true ? left.variant ?? `primary` : right.variant ?? `primary`)))
    setStyle(() => {
      return { left: x, width: w }
    })
  }

  useEffect(() => {
    toggle(left.value === value)
  }, [])

  return (
    <Grid
      ref={containerRef}
      className={`cursor-pointer relative max-w-fit flex 
      border border-neutral border-opacity-50 
      mt-${spacing} ${p} ${rounded ? 'rounded-full' : ''}`}
      onClickCapture={() => toggle()}
    >
      <Grid>
        <div
          style={style}
          className={`absolute transition-all duration-100 ${bg} ${p} ${
            rounded ? 'rounded-full' : ''
          }`}
        >
          <span className="opacity-0">.</span>
        </div>
      </Grid>

      <Grid
        ref={leftRef}
        className={`z-10 ${p} transition-all duration-400 ${
          pointLeft === true ? 'text-base-100' : 'opacity-50'
        }`}
      >
        <div className="max-w-fit float-right">{left.label}</div>
      </Grid>

      <Grid
        ref={middleRef}
        className={`text-center z-20 flex justify-items-center py-${spacing}`}
      >
        <MuiArrowLeftIcon
          className={`${
            style +
            (pointLeft === true
              ? ' animate-flip-left rotate-0'
              : ' animate-flip-right rotate-180')
          } 
            text-base-100
        `}
        />
      </Grid>

      <Grid
        ref={rightRef}
        className={`z-10 ${p} transition-all duration-400  ${
          pointLeft === false ? 'text-base-100' : 'opacity-50'
        }`}
      >
        <div className="max-w-fit">{right.label}</div>
      </Grid>

      {label && (
        <label
          className={`absolute left-1 -top-${spacing} bg-base-100 px-${spacing}`}
        >
          {label}
        </label>
      )}
    </Grid>
  )
}

export default BinarySelector
