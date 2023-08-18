import {Grid} from '@mui/material'
import useDebug from 'hooks/useDebug'
import {FollowerTypes,Role,RoleString,UserTypes} from 'prisma/prismaContext'
import React,{ReactNode,useEffect,useState} from 'react'

const {debug, level}= useDebug('EditRole', 'DEBUG')

type GridItemProps = {
    role:           UserTypes|FollowerTypes|string
    children?:      ReactNode
    allowedRoles?:  Role[]
    value:          RoleString[]
    setValue:       React.Dispatch<React.SetStateAction<RoleString[]>>
}

const defaultAllowedRoles:Role[] = ['COMMENT', 'READ', 'SHARE', 'FEEDBACK']

const EditRole = ({role, value, setValue, allowedRoles = defaultAllowedRoles, children}:GridItemProps) => {
    // TODO: set none to override default,
    // should differentiate between a blank array, and 'NONE'
    const [none, setNone] = useState(allowedRoles.length > 0)
    const [read, setRead] = useState(value.includes('READ'))
    const [comment, setComment] = useState(value.includes('COMMENT'))
    const [feedback, setFeedback] = useState(value.includes('FEEDBACK'))
    const [share, setShare] = useState(value.includes('SHARE'))
    
    const allPermissions = allowedRoles.map(r => {
      if (r === 'READ') return read
      else if (r === 'COMMENT') return comment
      else if (r === 'FEEDBACK') return feedback
      else if (r === 'SHARE') return share
    }).filter(a => a !== null && a !== undefined)
    const all = allPermissions.length > 0 && allPermissions.every(a => a === true)

    const canRead = allowedRoles.includes('READ')
    const canComment = allowedRoles.includes('COMMENT')
    const canShare = allowedRoles.includes('SHARE')
    const canFeedback = allowedRoles.includes('FEEDBACK')

    const toggleAll = (set:boolean) => {
      debug('toggleAll', {allowedRoles, allPermissions})
        if (canRead) setRead(() => set)
        if(canComment) setComment(() => set)
        if(canFeedback) setFeedback(() => set)
        if(canShare) setShare(() => set)
        if (set) setNone(() => false)
        update()
    }

    const update = () => {
      let params: RoleString[] = []
      //  this can return an emty array if none is off
      if (none) {
        params.push('NONE')
      } else {
        if (read) params.push('READ')
        if (share) params.push('SHARE')
        if (comment) params.push('COMMENT')
        if (feedback) params.push('FEEDBACK')
      }
      debug('update', { none, read, share, comment, feedback, params, value })
      setValue(() => params)
    }

    useEffect(() => {
      update()
    }, [none, read, share, comment, feedback])

    const itemBG = (allowed: boolean, active: boolean) =>
      allowed
        ? active
          ? 'cursor-pointer font-semibold bg-primary text-neutral-content hover:bg-gray-300 hover:text-neutral-content'
          : 'cursor-pointer bg-gray-300 bg-opacity-50 text-primary-content text-opacity-50 hover:bg-opacity-50 hover:bg-primary hover:text-primary-content'
        : 'cursor-not-allowed bg-gray-300 bg-opacity-50 text-primary-content text-opacity-50'

    const checkedBG = (active:boolean, c?:string) => active ? c ?? `checkbox checkbox-primary` : `checkbox checkbox-content`

    const GridItem = ({label, val, setVal}:{label:string, val:boolean, setVal: React.Dispatch<React.SetStateAction<boolean>>}) => {
      const allowed = allowedRoles.includes(label.toUpperCase() as Role)
      return (
      <Grid item xs={2} className={`
        ${itemBG(allowed, val)}`} 
        onClick={allowed ? () => setVal((current) => !current) : () => {}}>
        <div className={`text-center items-center text-sm`}>{label}</div>
        <div className={`text-center items-center text-sm`}><input disabled={!allowed} type='checkbox' checked={val} className={checkedBG(val)} onChange={() => {}} /></div>
      </Grid>
    )}

    useEffect(() => {
      toggleAll(false)
    }, [allowedRoles])

  return (
    <>
      <div className="text-primary font-bold my-4">
        {role}
        {level === 'DEBUG' && <span>: [{value.join(',')}]</span>}
      </div>
      {children && <div className="text-sm -mt-4 mb-4">{children}</div>}
      <div className="px-4">
        <Grid container spacing={2}>
          {/* LABEL */}
          <Grid
            item
            xs={2}
            className={itemBG(allPermissions.length > 0, all)}
            onClick={() => toggleAll(!all)}
          >
            <div className={`text-center items-center text-sm`}>Toggle All</div>
            <div className={`text-center items-center text-sm`}>
              {none || read ? 'Custom' : 'Use Default'}
            </div>
          </Grid>

          {/* NONE */}
          <Grid
            item
            xs={2}
            className={itemBG(allowedRoles.length > 0, none)}
            onClick={allowedRoles.length > 0 ? () => {
              const set = !none
              setNone(() => set)
              if (set) {
                setRead(() => false)
                setComment(() => false)
                setShare(() => false)
                setFeedback(() => false)
              }
            } : () => {}}
          >
            <div className={`text-center items-center text-sm`}>NONE</div>
            <div className={`text-center items-center text-sm`}>
              <input
                type="checkbox"
                disabled={allowedRoles.length < 1}
                checked={none}
                className={checkedBG(none)}
                onChange={() => {}}
              />
            </div>
          </Grid>

          <GridItem
            label="Read"
            val={read}
            setVal={() => {
              const set = !read
              setRead(() => set)
              if (!set) {
                setComment(() => false)
                setShare(() => false)
                setFeedback(() => false)
              }
              if (set && none) setNone(() => false)
            }}
          />
          <GridItem
            label="Share"
            val={share}
            setVal={() => {
              const set = !share
              if (set && canRead) setRead(() => true)
              setShare(() => set)
              if (set && none) setNone(() => false)
            }}
          />
          <GridItem
            label="Comment"
            val={comment}
            setVal={() => {
              const set = !comment
              if (set && canRead) setRead(() => true)
              setComment(() => set)
              if (set && none) setNone(() => false)
            }}
          />
          <GridItem
            label="Feedback"
            val={feedback}
            setVal={() => {
              const set = !feedback
              if (set && canRead) setRead(() => true)
              setFeedback(() => set)
              if (set && none) setNone(() => false)
            }}
          />
        </Grid>
      </div>
    </>
  )
}

export default EditRole