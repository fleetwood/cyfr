import {Typography,IconButton} from '@mui/material'
import React from 'react'
import {SizeProps, stringToColour} from 'types/props'
import UserAvatar, {AvatarUser, AvatarVariants} from './userAvatar'
import {CyfrUser, UserStub} from 'prisma/types'

type AvatarPillProps = {
  user:       CyfrUser | UserStub
  direction?: 'left'|'right'
  sz?:        SizeProps
  variant?:   AvatarVariants[]
  className?: string
}

const AvatarPill = ({
  user,
  sz = 'md',
  variant = ['no-profile', 'no-link'],
  direction = 'right',
  className
}: AvatarPillProps) => {
  return (
    <div className={`flex flex-row bg-base-200 rounded-full max-w-fit ${className}`}>
      {direction === 'left' && (
        <IconButton sx={{ p: 0 }}>
          <UserAvatar user={user} variant={variant} sz={sz} />
        </IconButton>
      )}
      <div className={`text-${direction} px-4 cursor-default`}>
        <span className="font-semibold text-base-content">{user.name}</span>
        <br />
        <Typography
          className="font-semibold"
          sx={{
            color: stringToColour(user.membership?.type.name ?? 'public'),
          }}
        >
          {user.membership?.type.name}
        </Typography>
      </div>
      {direction === 'right' && (
        <IconButton sx={{ p: 0 }}>
          <UserAvatar user={user} variant={variant} sz={sz} />
        </IconButton>
      )}
    </div>
  )
}

export default AvatarPill