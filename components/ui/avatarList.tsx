import { AvatarSizeProps } from "../../utils/cloudinary";
import { uuid } from "../../utils/helpers";
import Avatar from "./avatar";

type AvatarListProps = {
  sz:     AvatarSizeProps
  users:  any[]
  limit?: number
}

const AvatarList = ({ users, sz = "sm", limit = 4 }: AvatarListProps) => {
  const total = users.length > limit ? limit : users.length
  const extra = users.length > limit ? users.length-limit:0
  
  return (
    <div className={`avatar-group`}>
      {users && users.slice(0,total).map(user => {
        // @ts-ignore, mapping that has to happen bc sql fncs return the user as json, not typed. Meh.
        const {id, name, image} = user.author || user
        return <Avatar user={{id, name, image}} sz={sz} key={uuid()} />
      })}
      {extra > 0 &&
        <div className="avatar placeholder p-2 border-2 bg-base-100 text-base-content text-center align-middle text-xs">+{extra.toString()}</div>
      }

    </div>
  );
};

export default AvatarList;
