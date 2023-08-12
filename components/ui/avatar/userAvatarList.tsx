import { AvatarGroup, Chip } from "@mui/material";
import { SizeProps } from "types/props";
import { abbrNum, uuid } from "utils/helpers";
import UserAvatar, { AvatarVariants } from "./userAvatar";

type AvatarListProps = {
  sz:     SizeProps
  users:  any[]
  limit?: number
  variant?: AvatarVariants[]
  count?: number
}


const UserAvatarList = ({ users, sz = "sm", limit = 4, count = 0, variant = ['no-profile'] }: AvatarListProps) => (
  <AvatarGroup>
    {users && users.filter(u => u !== null).slice(0,limit).map(user => (
      <UserAvatar user={user} sz={sz} key={uuid()} variant={variant} />
    ))}
    {count > limit && 
      <Chip label={`+${abbrNum(count-limit)}`} size="small" variant="outlined" />
    }
  </AvatarGroup>
)

export default UserAvatarList;
