import useDebug from 'hooks/useDebug'
import { ArtistStub } from 'prisma/types'
import UserAvatar, { AvatarProps } from './userAvatar'

const { debug, jsonBlock } = useDebug('ArtistAvatar')

type ArtistAvatarProps = AvatarProps & {
  user: ArtistStub
}

const ArtistAvatar = (props: ArtistAvatarProps) => (
  <UserAvatar {...props} user={props.user.user} />
)

export default ArtistAvatar
