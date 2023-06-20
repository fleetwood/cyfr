import { SizeProps } from "types/props";
import { uuid } from "../../utils/helpers";
import Avatar, { AvatarVariants } from "./avatar";

type AvatarListProps = {
  sz:     SizeProps
  users:  any[]
  limit?: number
  variant?: AvatarVariants[]
}

const AvatarList = ({ users, sz = "sm", limit = 4, variant = ['no-profile'] }: AvatarListProps) => {
  const total = users.length > limit ? limit : users.length
  const extra = users.length > limit ? users.length-limit:0
  
  return (
    <div className={`avatar-group`}>
      {users && users.filter(u => u !== null).slice(0,total).map(user => {
        const {id, name, image} = user
        return <Avatar user={{id, name, image}} sz={sz} key={uuid()} variant={variant} />
      })}
      {extra > 0 &&
        <div className="avatar placeholder p-2 border-2 bg-base-100 text-base-content text-center align-middle text-xs">+{extra.toString()}</div>
      }

    </div>
  );
};

export default AvatarList;
