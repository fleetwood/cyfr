import {Permission, Role} from 'prisma/prismaContext'

/**
 * String variants of the different available user types, as defined in {@link Permission}
 * Note there are no values for `Audience.NONE` or `Audience.BLOCKED` as these don't exist
 * in the `Permission` model. 
 */
export type Audience = 'agent'|'artist'|'author'|'editor'|'member'|'public'|'reader'

export type RoleString = 'BLOCKED'|'NONE'|'READ'|'SHARE'|'COMMENT'|'FEEDBACK'|'OWNER'|'ADMIN'
type RoleVal = {
    role: RoleString
    val: number
}
/**
 * Used to check to see if `p` {@link PermissionStub}|{@link Permission} contains the role for `a` {@link Audience}
 * which corresponds to {@link RoleString}, a string variant of {@link Role}
 */
type RoleCheck = {
    a:Audience
    p:PermissionStub|Permission
}

/**
 * Can be used to get a number value for the different {@link Role}s
 * 
 * Usage: `RoleVals.NONE`, `RoleVals.SHARE`, etc...
 * 
 * @param NAME {@link RoleString}
 * 
 * @returns role {@link RoleString}, val {@link Number} as {@link RoleVal}
 */
export const RoleVals = {
    BLOCKED: {role: 'BLOCKED', val: 0} as RoleVal
    ,NONE: {role: 'NONE', val: 1} as RoleVal
    ,READ: {role: 'READ', val: 100} as RoleVal
    ,SHARE: {role: 'SHARE', val: 200} as RoleVal
    ,COMMENT: {role: 'COMMENT', val: 300} as RoleVal
    ,FEEDBACK: {role: 'FEEDBACK', val: 400} as RoleVal
    ,OWNER: {role: 'OWNER', val: 1000} as RoleVal
    ,ADMIN: {role: 'ADMIN', val: 2000} as RoleVal
}

export const getRoles = ({a,p}:RoleCheck) => {
    switch (a.toLowerCase()) {
        case 'agent': return p.agent
        case 'artist': return p.artist
        case 'author': return p.author
        case 'editor': return p.editor
        case 'member': return p.member
        case 'reader': return p.reader
    }
    return p.public
}

const resolve = ({a,p,r}:(RoleCheck & {r:RoleVal})) => getRoles({a,p}).filter(a => a.includes(r.role)).length>0

/**
 * Utility helpers for Roles
 * 
 * @prop {@link Audience} a
 * @prop {@link PermissionStub|Permission} p
 */
export const Roles = {
    isBlocked:      ({a,p}:RoleCheck) => resolve({a,p,r:RoleVals.BLOCKED})
    , isOwner:      ({a,p}:RoleCheck) => resolve({a,p,r:RoleVals.OWNER})
    , isAdmin:      ({a,p}:RoleCheck) => resolve({a,p,r:RoleVals.ADMIN})
    , canRead:      ({a,p}:RoleCheck) => resolve({a,p,r:RoleVals.READ})
    , canShare:     ({a,p}:RoleCheck) => resolve({a,p,r:RoleVals.SHARE})
    , canComment:   ({a,p}:RoleCheck) => resolve({a,p,r:RoleVals.COMMENT})
    , canFeedback:  ({a,p}:RoleCheck) => resolve({a,p,r:RoleVals.FEEDBACK})
}

export type PermissionStub = Permission & {
}

export const PermissionStubInclude = {
    include: {
        
    }
}