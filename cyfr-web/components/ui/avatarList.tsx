import { User } from ".prisma/client";
import Link from "next/link";
import { uuid } from "../../utils/helpers";
import Avatar from "./avatar";
import { AvatarSizeProps } from "../../utils/cloudinary";

type AvatarListProps = AvatarSizeProps & {
  users: User[]
  limit?: number
}

const AvatarList = ({ users, sz = "sm", limit = 4 }: AvatarListProps) => {
  const total = users.length > limit ? limit : users.length
  const extra = users.length > limit ? users.length-limit:0
  
  return (
    <div className={`avatar-group`}>
      {users && users.slice(0,total).map(user => (
        <Avatar user={user} sz={sz} key={uuid()} />
      ))}
      {extra > 0 &&
        <div className="avatar placeholder p-2 border-2 bg-base-100 text-base-content text-center align-middle text-xs">+{extra.toString()}</div>
      }

    </div>
  );
};

export default AvatarList;
