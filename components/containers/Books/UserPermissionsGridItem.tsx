import { Grid } from '@mui/material'
import React, { ReactNode, useEffect, useState } from 'react'

type GridItemProps = {
    level: string
    children?:ReactNode
}

const UserPermissionsGridItem = ({level, children}:GridItemProps) => {
    const [canRead, setCanRead] = useState(false)
    const [canComment, setCanComment] = useState(false)
    const [canFeedback, setCanFeedback] = useState(false)
    const [canShare, setCanShare] = useState(false)
    
    const allPermissions = [canRead, canComment, canFeedback, canShare]

    const all = allPermissions.filter(c => c===true).length===allPermissions.length

    const toggleAll = () => {
        const set = !all
        setCanRead(() => set)
        setCanComment(() => set)
        setCanFeedback(() => set)
        setCanShare(() => set)
    }

    const setItem = (val:boolean, setVal:React.Dispatch<React.SetStateAction<boolean>>) => {
        const n = !val
        if (n === true) {
            setCanRead(() => true)
        }
        setVal(n)
    }

    const itemBG = (active:boolean) => active ? 'font-semibold bg-primary text-neutral-content hover:bg-gray-300 hover:text-neutral-content' 
                                              : 'bg-gray-300 bg-opacity-50 text-primary-content text-opacity-50 hover:bg-opacity-50 hover:bg-primary hover:text-primary-content'
    const checkedBG = (active:boolean) => active ? `checkbox checkbox-primary` : `checkbox checkbox-content`

    const GridItem = ({label, val, setVal}:{label:string, val:boolean, setVal: React.Dispatch<React.SetStateAction<boolean>>}) => (
        <Grid sm className={`cursor-pointer ${itemBG(val)}`} onClick={() => setItem(val, setVal)}>
            <div className={`text-center p-2 items-center`}>{label}</div>
            <div className={`text-center p-2 items-center`}><input type='checkbox' checked={val} className={checkedBG(val)} /></div>
        </Grid>
    )

    useEffect(() => {
        if (!canRead) {
            setCanShare(false)
            setCanComment(false)
            setCanFeedback(false)
        }
    }, [canRead])

  return <>
        <div className='text-primary font-bold my-4'>{level}</div>
        {children && <div className='text-sm -mt-4 mb-4'>{children}</div>}
        <div className='px-4'>
            <Grid container spacing={2}>
                <Grid xs={1} display="flex" justifyContent="center" alignItems="center" className={`cursor-pointer ${itemBG(all)}`} onClick={toggleAll} >
                    <span>Toggle All</span>
                </Grid>
                
                <GridItem label='Read' val={canRead} setVal={setCanRead} />
                <GridItem label='Share' val={canShare} setVal={setCanShare} />
                <GridItem label='Comment' val={canComment} setVal={setCanComment} />
                <GridItem label='Feedback' val={canFeedback} setVal={setCanFeedback} />

            </Grid>
        </div>
  </>
}

export default UserPermissionsGridItem