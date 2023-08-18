import {Grid} from '@mui/material'
import useDebug from 'hooks/useDebug'
import {FollowerTypes,Role,RoleString,UserTypes} from 'prisma/prismaContext'
import React,{ReactNode,useEffect,useState} from 'react'

const {debug, level}= useDebug('EditRole', 'DEBUG')

type GridItemProps = {
    role:       UserTypes|FollowerTypes|string
    children?:  ReactNode
    allowedRoles?: Role[]
    value:      RoleString[]
    setValue:   React.Dispatch<React.SetStateAction<RoleString[]>>
}

const defaultAllowedRoles:Role[] = ['NONE', 'COMMENT', 'READ', 'SHARE', 'FEEDBACK']

const EditRole = ({role, value, setValue, allowedRoles = defaultAllowedRoles, children}:GridItemProps) => {
    // TODO: set none to override default,
    // should differentiate between a blank array, and 'NONE'
    const [none, setNone] = useState(value.includes('NONE'))
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

    const isAllowed = (role:Role) => allowedRoles.includes(role)

    const toggleAll = (set:boolean) => {
      debug('toggleAll', {allowedRoles, allPermissions})
        if (isAllowed('READ')) setRead(() => set)
        if(isAllowed('COMMENT')) setComment(() => set)
        if(isAllowed('FEEDBACK')) setFeedback(() => set)
        if(isAllowed('SHARE')) setShare(() => set)
        if (set && isAllowed('NONE')) setNone(() => false)
        update()
    }

    const update = () => {
      debug('update')
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
      setValue(() => [...params])
    }

    useEffect(() => {
      update()
    }, [read, share, comment, feedback])

    const itemBG = (allowed: boolean, active: boolean) =>
      allowed
        ? active
          ? 'cursor-pointer font-semibold bg-primary text-neutral-content hover:bg-gray-300 hover:text-neutral-content'
          : 'cursor-pointer bg-gray-300 bg-opacity-50 text-primary-content text-opacity-50 hover:bg-opacity-50 hover:bg-primary hover:text-primary-content'
        : 'cursor-not-allowed bg-gray-300 bg-opacity-50 text-primary-content text-opacity-50'

    const checkedBG = (active:boolean, c?:string) => active ? c ?? `checkbox checkbox-primary` : `checkbox checkbox-content`

    const GridItem = ({label, val, setVal}:{label:string, val:boolean, setVal: React.Dispatch<React.SetStateAction<boolean>>}) => {
      const allowed = isAllowed(label.toUpperCase() as Role)
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
            onClick={allowedRoles.length > 0 ? () => setNone(!none) : () => {}}
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