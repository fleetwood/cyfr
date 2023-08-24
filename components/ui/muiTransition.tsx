import { Slide, SlideProps } from "@mui/material"
import { TransitionProps } from "@mui/material/transitions"
import React from "react"

export const TransitionDown = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="down" ref={ref} {...props} />
  })
  

export const TransitionLeft = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="left" ref={ref} {...props} />
  })
  

export const TransitionRight = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="right" ref={ref} {...props} />
  })
  

export const TransitionUp = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />
  })

const MuiTransition = (direction:SlideProps["direction"]) => {
    switch (direction) {
        case 'down': return TransitionDown
        case "left": return TransitionLeft
        case "right": return TransitionRight
        case 'up':
        default: return TransitionDown
    }
}

export default MuiTransition