import { PermissionCreateProps, Role, RoleString } from 'prisma/prismaContext'
import EditRole from './EditRole'
import Semibold from 'components/ui/semibold'
import { Box } from '@mui/material'
import { Dispatch, ReactNode, SetStateAction } from 'react'
import Label from 'components/ui/label'

type EditPermissionProps = {
  label?:     ReactNode
  className?: string
  permission: PermissionCreateProps
  setPermission: Dispatch<SetStateAction<PermissionCreateProps>>
}

const EditPermission = ({
  label,
  className,
  permission,
  setPermission,
}: EditPermissionProps) => {
  const changeAgent = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, agent: perms.flatMap((a) => a) as Role[] }
    })
  const changeEditor = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, editor: perms.flatMap((a) => a) as Role[] }
    })
  const changeAuthor = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, author: perms.flatMap((a) => a) as Role[] }
    })
  const changeArtist = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, artist: perms.flatMap((a) => a) as Role[] }
    })
  const changeMember = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, member: perms.flatMap((a) => a) as Role[] }
    })
  const changePublic = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, public: perms.flatMap((a) => a) as Role[] }
    })

  const changeFriend = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, friend: perms.flatMap((a) => a) as Role[] }
    })
  const changeStan = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, stan: perms.flatMap((a) => a) as Role[] }
    })
  const changeFollowing = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, following: perms.flatMap((a) => a) as Role[] }
    })
  const changeFan = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, fan: perms.flatMap((a) => a) as Role[] }
    })
  const changeFollower = (perms: RoleString[]) =>
    setPermission(() => {
      return { ...permission, follower: perms.flatMap((a) => a) as Role[] }
    })

  return (
    <Box className={`flex flex-col ${className}`}>
      {label && <Label>{label}</Label>}
      <EditRole role="Author" onChange={changeAuthor}>
        <p></p>
      </EditRole>

      <EditRole role="Artist" onChange={changeArtist}>
        <p></p>
      </EditRole>

      <EditRole role="Editor" onChange={changeEditor}>
        <p>
          Are you shopping for a good editor? Join the club! Better yet, invite
          them to yours! :)
        </p>
      </EditRole>

      <EditRole role="Agent" onChange={changeAgent}>
        <p></p>
      </EditRole>

      <EditRole role="Reader" onChange={changeMember}>
        <p>
          Any logged-in Cyfr member that does not fall into one of the above
          categories is classified as a <Semibold>Reader</Semibold>.
        </p>
      </EditRole>

      <EditRole role="Public" onChange={changePublic}>
        <p>
          This is anybody who visits the site but is not logged in, including{' '}
          <Semibold>bots and search engines</Semibold>.
        </p>
      </EditRole>

      <EditRole role="Friends" onChange={changeFriend}>
        <p>You follow them, and they follow you back.</p>
      </EditRole>

      <EditRole role="Stans" onChange={changeStan}>
        <p>The people you Stan.</p>
      </EditRole>

      <EditRole role="Following" onChange={changeFollowing}>
        <p>Those whom you follow.</p>
      </EditRole>

      <EditRole role="Fans" onChange={changeFan}>
        <p>Your fans!!</p>
      </EditRole>

      <EditRole role="Followers" onChange={changeFollower}>
        <p>Your followers.</p>
      </EditRole>
    </Box>
  )
}

export default EditPermission
