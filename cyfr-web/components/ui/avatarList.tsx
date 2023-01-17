import { User } from ".prisma/client";
import Link from "next/link";
import { uuid } from "../../utils/helpers";
import Avatar from "./avatar";

type AvatarListProps = {
  users: User[]
  sz?: "sm" | "md" | "lg"
  limit?: number
}

const AvatarList = ({ users, sz = "sm", limit = 4 }: AvatarListProps) => {
  const total = users.length > limit ? limit : users.length
  const extra = users.length > limit ? users.length-limit:0
  
  return (
    <div className="avatar-group -space-x-6">
      {users && users.slice(0,total).map(user => 
        user.image ? <Avatar user={user} sz={sz} key={uuid()} />
        :
        <div className="avatar">
          <div className="w-12">
                <Link href={`/user/${user.id}`} >
                  <span>{user.name?.split('')[0] || '?'}</span>
                </Link>
          </div>
        </div>
      )}
      {extra > 0 &&
        <div className="avatar placeholder">
          <div className="w-12 bg-neutral-focus text-neutral-content">
            <span>+{extra}</span>
          </div>
        </div>
      }

    </div>
  );
};

export default AvatarList;
