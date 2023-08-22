import useDebug from 'hooks/useDebug'
import { AuthorStub } from 'prisma/types'
import UserAvatar, { AvatarProps } from './userAvatar'

const { debug, jsonBlock } = useDebug('AuthorAvatar')

type AuthorAvatarProps = AvatarProps & {
  author: AuthorStub
}

const AuthorAvatar = (props: AuthorAvatarProps) => (
  <UserAvatar {...props} user={props.author.user} userType={'Author'} />
)

export default AuthorAvatar
