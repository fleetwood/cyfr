import { Grid } from '@mui/material'
import { RoleString } from 'prisma/prismaContext'
import React, { ReactNode, useEffect, useState } from 'react'


type GridItemProps = {
    level: string
    children?:ReactNode
    onChange?: (permList:RoleString[]) => void
}

const BookPermissions = ({level, onChange, children}:GridItemProps) => {
    const [read, setRead] = useState(false)
    const [comment, setComment] = useState(false)
    const [feedback, setFeedback] = useState(false)
    const [share, setShare] = useState(false)
    
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
    const checkedBG = (active:boolean) => active ? `checkbox checkbox-primary` : `checkbox checkbox-content`

    const GridItem = ({label, val, setVal}:{label:string, val:boolean, setVal: React.Dispatch<React.SetStateAction<boolean>>}) => (
        <Grid className={`cursor-pointer ${itemBG(val)}`} onClick={() => setItem(val, setVal)}>
            <div className={`text-center items-center text-sm`}>{label}</div>
            <div className={`text-center items-center text-sm`}><input type='checkbox' checked={val} className={checkedBG(val)} onChange={() => {}} /></div>
        </Grid>
    )

    useEffect(() => {
        if (!read) {
            setShare(false)
            setComment(false)
            setFeedback(false)
        }
    }, [read])

    useEffect(() => {
        let params:RoleString[] = []
        if (read) {
            params.push('READ')
            if (share) params.push('SHARE')
            if (comment) params.push('COMMENT')
            if (feedback) params.push('FEEDBACK')
        } else {
            params.push('NONE')
        }
        onChange && onChange(params)
    }, [read, share, comment, feedback])

  return <>
    <div className='text-primary font-bold my-4'>{level}</div>
    {children && <div className='text-sm -mt-4 mb-4'>{children}</div>}
    <div className='px-4'>
        <Grid container spacing={2}>
            <Grid columns={1} display="flex" justifyContent="center" alignItems="center" className={`cursor-pointer ${itemBG(all)}`} onClick={toggleAll} >
                <span>Toggle All</span>
            </Grid>
            
            <GridItem label='Read' val={read} setVal={setRead} />
            <GridItem label='Share' val={share} setVal={setShare} />
            <GridItem label='Comment' val={comment} setVal={setComment} />
            <GridItem label='Feedback' val={feedback} setVal={setFeedback} />

        </Grid>
    </div> 
  </>
}

export default BookPermissions