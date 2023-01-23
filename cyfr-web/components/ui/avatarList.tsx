import { User } from ".prisma/client";
import Link from "next/link";
import { uuid } from "../../utils/helpers";
import Avatar from "./avatar";

type AvatarListProps = {
  users: User[]
  sz?: "wee" | "sm" | "md" | "lg"
  limit?: number
}

const AvatarList = ({ users, sz = "sm", limit = 4 }: AvatarListProps) => {
  const total = users.length > limit ? limit : users.length
  const extra = users.length > limit ? users.length-limit:0
  const space = `-space-x-${sz === 'wee' ? '4' : sz === 'sm' ? '8' : '12'}`
  
  return (
    <div className={`avatar-group ${space}`}>
      {users && users.slice(0,total).map(user => 
        user.image ? <Avatar user={user} sz={sz} key={uuid()} />
        :
        <div className="avatar placeholder">
          <Link href={`/user/${user.id}`} >
            <span>{user.name?.split('')[0] || '?'}</span>
          </Link>
        </div>
      )}
      {extra > 0 &&
        <div className="avatar placeholder p-2 border-2 bg-base-100 text-base-content text-center align-middle text-xs">+{extra.toString()}</div>
      }

    </div>
  );
};

export default AvatarList;
