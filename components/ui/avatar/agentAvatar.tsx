import useDebug from "hooks/useDebug"
import {AgentStub} from "prisma/types"
import UserAvatar, {AvatarProps} from "./userAvatar"

const {debug, jsonBlock} = useDebug('AgentAvatar')

type AgentAvatarProps = AvatarProps & {
  user: AgentStub
}

const AgentAvatar = (props: AgentAvatarProps) => <UserAvatar {...props} user={props.user.user} />

export default AgentAvatar
