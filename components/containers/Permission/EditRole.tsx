import { Grid } from '@mui/material'
import { FollowerTypes, RoleString, UserTypes } from 'prisma/prismaContext'
import React, { ReactNode, useEffect, useState } from 'react'

type GridItemProps = {
    role:       UserTypes|FollowerTypes|string
    children?:  ReactNode
    value:      RoleString[]
    setValue:   (roles:RoleString[]) => void
}

const EditRole = ({role, value, setValue, children}:GridItemProps) => {
    // TODO: set none to override default,
    // should differentiate between a blank array, and 'NONE'
    const [none, setNone] = useState(value.includes('NONE'))
    const [read, setRead] = useState(value.includes('READ'))
    const [comment, setComment] = useState(value.includes('COMMENT'))
    const [feedback, setFeedback] = useState(value.includes('FEEDBACK'))
    const [share, setShare] = useState(value.includes('SHARE'))
    
    const allPermissions = [read, comment, feedback, share]

    const all = allPermissions.filter(c => c===true).length===allPermissions.length

    const toggleAll = () => {
        const set = !all
        setRead(() => set)
        setComment(() => set)
        setFeedback(() => set)
        setShare(() => set)
    }

    const setItem = (val:boolean, setVal:React.Dispatch<React.SetStateAction<boolean>>) => {
        const n = !val
        if (n === true) {
            setRead(() => true)
        }
        setVal(n)
    }

    const itemBG = (active:boolean) => active ? 'font-semibold bg-primary text-neutral-content hover:bg-gray-300 hover:text-neutral-content' 
                                              : 'bg-gray-300 bg-opacity-50 text-primary-content text-opacity-50 hover:bg-opacity-50 hover:bg-primary hover:text-primary-content'
    const checkedBG = (active:boolean, c?:string) => active ? c ?? `checkbox checkbox-primary` : `checkbox checkbox-content`

    const GridItem = ({label, val, setVal}:{label:string, val:boolean, setVal: React.Dispatch<React.SetStateAction<boolean>>}) => (
        <Grid item xs={2} className={`cursor-pointer ${itemBG(val)}`} onClick={() => setItem(val, setVal)}>
            <div className={`text-center items-center text-sm`}>{label}</div>
            <div className={`text-center items-center text-sm`}><input type='checkbox' checked={val} className={checkedBG(val)} onChange={() => {}} /></div>
        </Grid>
    )

    useEffect(() => {
        if (!read) {
            setShare(false)
            setComment(false)
            setFeedback(false)
        } else if (read) {
            setNone(false)
        }
    }, [read])

    const toggleNone = (n:boolean) => {
        setNone(n)
        if (n) {
            setRead(false)
            setShare(false)
            setComment(false)
            setFeedback(false)
        }
    }

    useEffect(() => {
        let params:RoleString[] = []
        // this can return an emty array if none is off
        if (none) {
            params.push('NONE')
        } else if (read) {
            params.push('READ')
            if (share) params.push('SHARE')
            if (comment) params.push('COMMENT')
            if (feedback) params.push('FEEDBACK')
        }
        setValue(params)
    }, [read, share, comment, feedback])

  return (
    <>
      <div className="text-primary font-bold my-4">{role}</div>
      {children && <div className="text-sm -mt-4 mb-4">{children}</div>}
      <div className="px-4">
        <Grid container spacing={2}>
          <Grid
            item
            xs={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={`cursor-pointer ${itemBG(all)}`}
            onClick={toggleAll}
          >
            <span>Toggle All</span>
          </Grid>

          <Grid
            item
            xs={2}
            className={`cursor-pointer ${itemBG(none)}`}
            onClick={() => setItem(none, () => toggleNone(!none))}
          >
            <div className={`text-center items-center text-sm`}>NONE</div>
            <div className={`text-center items-center text-sm`}>
              <input
                type="checkbox"
                checked={none}
                className={checkedBG(none)}
                onChange={() => {}}
              />
            </div>
          </Grid>

          <GridItem label="Read" val={read} setVal={setRead} />
          <GridItem label="Share" val={share} setVal={setShare} />
          <GridItem label="Comment" val={comment} setVal={setComment} />
          <GridItem label="Feedback" val={feedback} setVal={setFeedback} />
        </Grid>
      </div>
    </>
  )
}

export default EditRole