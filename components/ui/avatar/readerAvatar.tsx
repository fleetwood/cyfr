import useDebug from 'hooks/useDebug'
import { ReaderStub } from 'prisma/types'
import UserAvatar, { AvatarProps } from './userAvatar'

const { debug, jsonBlock } = useDebug('ReaderAvatar')

type ReaderAvatarProps = AvatarProps & {
  user: ReaderStub
}

const ReaderAvatar = (props: ReaderAvatarProps) => (
  <UserAvatar {...props} user={props.user.user} />
)

export default ReaderAvatar
