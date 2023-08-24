import {Box} from '@mui/material'
import Label from 'components/ui/label'
import Semibold from 'components/ui/semibold'
import {PermissionCreateProps,Role,RoleString} from 'prisma/prismaContext'
import React,{ReactNode, useEffect, useState} from 'react'
import EditRole from './EditRole'
import {debug} from 'console'
import {DefaultPermissionProps} from 'prisma/maps/permission.map'

type EditPermissionProps = {
  label?:         ReactNode
  className?:     string
  value:          PermissionCreateProps
  allowedRoles?:  PermissionCreateProps
  setValue:       React.Dispatch<React.SetStateAction<PermissionCreateProps>>
}

const EditPermission = ({
  label,
  className,
  value,
  setValue,
  allowedRoles = DefaultPermissionProps
}: EditPermissionProps) => {

  const [author, setAuthor] = useState(value.author)
  const [artist, setArtist] = useState(value.artist)
  const [agent, setAgent] = useState(value.agent)
  const [editor, setEditor] = useState(value.editor)
  const [fan, setFan] = useState(value.fan)
  const [follower, setFollower] = useState(value.follower)
  const [stan, setStan] = useState(value.stan)
  const [following, setFollowing] = useState(value.following)
  const [friend, setFriend] = useState(value.friend)
  const [member, setMember] = useState(value.member)
  const [publicRole, setPublicRole] = useState(value.public)

  return (
    <Box className={`flex flex-col ${className}`}>
      {label && <Label>{label}</Label>}

      <EditRole
        role="Author"
        value={author}
        setValue={setAuthor}
        allowedRoles={allowedRoles.author}
      >
        <p></p>
      </EditRole>

      <EditRole
        role="Artist"
        value={artist}
        setValue={setArtist}
        allowedRoles={allowedRoles.artist}
      >
        <p></p>
      </EditRole>

      <EditRole
        role="Editor"
        value={editor}
        setValue={setEditor}
        allowedRoles={allowedRoles.editor}
      >
        <p>
          Are you shopping for a good editor? Join the club! Better yet, invite
          them to yours! :)
        </p>
      </EditRole>

      <EditRole
        role="Agent"
        value={agent}
        setValue={setAgent}
        allowedRoles={allowedRoles.agent}
      >
        <p></p>
      </EditRole>

      <EditRole
        role="Reader"
        value={member}
        setValue={setMember}
        allowedRoles={allowedRoles.member}
      >
        <p>
          Any logged-in Cyfr member that does not fall into one of the above
          categories is classified as a <Semibold>Reader</Semibold>.
        </p>
      </EditRole>

      <EditRole
        role="Public"
        value={publicRole}
        setValue={setPublicRole}
        allowedRoles={allowedRoles.public}
      >
        <p>
          This is anybody who visits the site but is not logged in, including{' '}
          <Semibold>bots and search engines</Semibold>.
        </p>
      </EditRole>

      <EditRole
        role="Stans"
        value={stan}
        setValue={setStan}
        allowedRoles={allowedRoles.stan}
      >
        <p>The people you Stan.</p>
      </EditRole>

      <EditRole
        role="Following"
        value={following}
        setValue={setFollowing}
        allowedRoles={allowedRoles.following}
      >
        <p>Those whom you follow.</p>
      </EditRole>

      <EditRole
        role="Fans"
        value={fan}
        setValue={setFan}
        allowedRoles={allowedRoles.fan}
      >
        <p>Your fans!!</p>
      </EditRole>

      <EditRole
        role="Followers"
        value={follower}
        setValue={setFollower}
        allowedRoles={allowedRoles.follower}
      >
        <p>Your followers.</p>
      </EditRole>

      <EditRole
        role="Friends"
        value={friend}
        setValue={setFriend}
        allowedRoles={allowedRoles.friend}
      >
        <p>
          You follow them and they follow you back. You don't both have to Stan
          each other, though that would be very friendly...
        </p>
      </EditRole>
    </Box>
  )
}

export default EditPermission
