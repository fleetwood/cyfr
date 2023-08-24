import useDebug from 'hooks/useDebug'
import { EditorStub } from 'prisma/types'
import UserAvatar, { AvatarProps } from './userAvatar'

const { debug, jsonBlock } = useDebug('EditorAvatar')

type EditorAvatarProps = AvatarProps & {
  user: EditorStub
}

const EditorAvatar = (props: EditorAvatarProps) => (
  <UserAvatar {...props} user={props.user.user} userType='Editor' />
)

export default EditorAvatar
