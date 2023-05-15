import { Transition } from "@headlessui/react";
import { useState } from "react";
import {
  CyfrUser,
  User,
  UserDetail,
  UserFeed,
  UserStub,
} from "../../prisma/prismaContext";
import { getApi } from "../../utils/api";
import { AvatarSizeProps, cloudinary } from "../../utils/cloudinary";
import Spinner from "./spinner";
import useDebug from "../../hooks/useDebug";

const {debug, jsonBlock} = useDebug('avatar')

type AvatarProps = {
  user?: CyfrUser | UserDetail | UserFeed | User | UserStub;
  link?: boolean;
  shadow?: boolean;
  className?: string;
  placeholder?: string;
  variant?: AvatarVariants[];
  sz: AvatarSizeProps;
};

export type AvatarVariants = 'default'|'no-profile'

const Avatar = ({
  user,
  placeholder,
  className,
  shadow,
  sz,
  link = true,
  variant = ['default'],
}: AvatarProps) => {
  const [showProfile, setShowProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<CyfrUser>()
  const allowProfile = variant.indexOf('no-profile')<0
  const content =
    user && user.image ? (
      <img
        src={cloudinary.avatar(user.image, sz as unknown as AvatarSizeProps)}
      />
    ) : placeholder ? (
      placeholder
    ) : user ? (
      user.name
    ) : (
      "?"
    );

    const online =
    // @ts-ignore
    user && user._count && user._count.sessions && user._count.sessions > 0
      ? "online"
      : "";
  // @ts-ignore
  const member = user?.membership?.level.toLowerCase() || "";
  
  const init = async () => {
    setShowProfile(() => true)
    if (userInfo) {
      return
    }

    setIsLoading(() => true)
    // get user infro from api
    const info = await getApi(`/user/info/${user?.id}`)
    
    if (info?.result) {
      debug('init', info)
      setUserInfo(() => info.result)
      setIsLoading(() => false)
    }
  }
  
  return (
    <div 
      className={`avatar ${online} ${member} relative`} 
      onMouseOverCapture={() => allowProfile ? init() : {}}
      onMouseOutCapture={() => setShowProfile(() => false)}
    >
      <div className={`mask mask-squircle`}>
        {link && user ? <a href={`/user/${user.name}`}>{content}</a> : content}
      </div>
      {allowProfile && userInfo && 
      <Transition
        show={showProfile}
        enter="transition-all duration-200"
        enterFrom="opacity-0 invisible"
        enterTo="opacity-100 inline"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 inline"
        leaveTo="opacity-0 invisible"
      >
        {isLoading && <Spinner />}
        {!isLoading && userInfo !== null &&
          <div className={`
            absolute z-10
            bg-base-300 text-base-content
            text-sm rounded-lg shadow-lg shadow-black
            `}
            >
              <div className="px-3 py-2 bg-primary text-primary-content rounded-t-lg">
                <h3 className="font-semibold">{userInfo?.name}</h3>
              </div>

              <div className="px-3 py-2 flex flex-row">
                
                <div className="flex flex-col p-2">
                  <div className="flex odd:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Posts</div>
                    <div>{(userInfo.posts??[]).length}</div>
                  </div>
                  <div className="flex odd:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Books</div>
                    <div>{(userInfo.books??[]).length}</div>
                  </div>
                  <div className="flex odd:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Galleries</div>
                    <div>{(userInfo.galleries??[]).length}</div>
                  </div>   
                </div>

                <div className="flex flex-col p-2">
                  <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Followers</div>
                    <div>{(userInfo.followers??[]).length}</div>
                  </div>
                  <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Fans</div>
                    <div>{(userInfo.followers?.filter(f => f.isFan === true)??[]).length}</div>
                  </div>
                  <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Follows</div>
                    <div>{(userInfo.follows??[]).length}</div>
                  </div>
                  <div className="flex even:bg-base-200 justify-between space-x-2 p-2">
                    <div className="font-semibold">Stans</div>
                    <div>{(userInfo.follows?.filter(f => f.isFan === true)??[]).length}</div>
                  </div>
                </div>

              </div>
          </div>
        }
      </Transition>
      }
    </div>
  );
};

export default Avatar;
