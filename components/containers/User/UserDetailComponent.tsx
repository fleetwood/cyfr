import { useState } from "react";
import useUserDetail from "../../../hooks/useUserDetail";
import { UserFollow } from "../../../prisma/prismaContext";
import { uniqueKey } from '../../../utils/helpers';
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
import { useToast } from "../../context/ToastContextProvider";
import Avatar from "../../ui/avatar";
import { FireIcon, HeartIcon } from "../../ui/icons";
import JsonBlock from "../../ui/jsonBlock";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";
import GalleryCreateView from "../Gallery/GalleryCreateView";
import GalleryItemView from "../Gallery/GalleryItemView";
import UserDetailPostItem from "../Post/UserDetailPostItem";

type UserDetailComponentProps = {
  userId: String;
};

const UserDetailComponent = ({ userId }: UserDetailComponentProps) => {
  const [cyfrUser] = useCyfrUserContext();
  const { currentUser, followers, follows, fans, stans, followUser, stanUser, invalidateUser } = useUserDetail({id: userId});
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState("Posts");

  const activeTabClass = (tab: string) =>
    activeTab === tab
      ? `btn-secondary rounded-b-none mt-0`
      : `btn-primary -mt-1`;

  const clickFollow = async () => {
    if (!cyfrUser || !currentUser) return;

    const result = await followUser({
      followerId: cyfrUser.id,
      followingId: currentUser.id,
      isFan: false
    });

    if (result) {
      notify({
        message: `You are now following ${currentUser.name}!`,
        type: "success",
      });
    }
    invalidateUser();
  };

  const clickStan = async () => {
    if (!cyfrUser || !currentUser) return;

    const result = await stanUser({
      followerId: currentUser.id,
      followingId: cyfrUser.id,
      isFan: true
    });

    if (result) {
      notify({
        message: `You are stanning ${currentUser.name}!!! Nice!`,
        type: "success",
      });
    }
    invalidateUser();
  };

  return (
    <div>
      {currentUser &&
        <img src={currentUser.image||''} className="-mt-2 mb-2 rounded-md min-w-full" />
      }
      <div
        className="
        grid grid-cols-9
        mx-2 mb-4
        md:mx-4 md:mb-8
        md:p-4
        rounded-md p-2 
        bg-base-100 bg-opacity-20 
        text-neutral-content
        "
      >
        <div className="col-span-7">
          <div
            className="
            flex items-start
            flex-col
            md:flex-row
            justify-between
            h-[50%]
            "
          >
            <div>
              <strong>Posts:</strong> {(currentUser?.posts||[]).length}
            </div>
            <div>
              <strong>Followers:</strong> {followers.length}
            </div>
            <div>
              <strong>Follows:</strong> {follows.length}
            </div>
            <div>
              <strong>Fans:</strong> {fans.length}
            </div>
            <div>
              <strong>Stans:</strong> {stans.length}
            </div>
          </div>
          <div
            className="
            flex 
            items-start
            md:items-end 
            justify-end 
            space-x-4 
            md:justify-start
            md:space-x-8
            md:border-t 
            border-base-content 
            border-opacity-50
            h-[50%]"
          >
            <ShrinkableIconButton
              label="Follow"
              icon={HeartIcon}
              className="bg-opacity-0 hover:shadow-none"
              iconClassName="text-primary"
              labelClassName="text-primary"
              onClick={clickFollow}
            />
            <ShrinkableIconButton
              label="Fan"
              icon={FireIcon}
              className="bg-opacity-0 hover:shadow-none"
              iconClassName="text-primary"
              labelClassName="text-primary"
              onClick={clickStan}
            />
          </div>
        </div>
      </div>

      {/* TAB BUTTONS */}
      <div className="border-b-8 border-secondary flex justify-between space-x-2">
        <button
          className={`btn ${activeTabClass("Posts")} w-[15%]`}
          onClick={() => setActiveTab("Posts")}
        >
          Posts
        </button>
        <button
          className={`btn ${activeTabClass("Galleries")} w-[15%]`}
          onClick={() => setActiveTab("Galleries")}
        >
          Galleries
        </button>
        <button
          className={`btn ${activeTabClass("Books")} w-[15%]`}
          onClick={() => setActiveTab("Books")}
        >
          Books
        </button>
        <button
          className={`btn ${activeTabClass("Follow")} w-[15%]`}
          onClick={() => setActiveTab("Follow")}
        >
          Follow
        </button>
        <button
          className={`btn ${activeTabClass("Fan")} w-[15%]`}
          onClick={() => setActiveTab("Fan")}
        >
          Fan
        </button>
      </div>

      {/* GALLERIES */}
      {activeTab === "Galleries" && (
        <div className="flex flex-col space-y-4 my-4">
          {currentUser?.id === cyfrUser.id &&
            <GalleryCreateView />
          }

          <div className="bg-base-100 my-4 p-4 rounded-md">
            {currentUser?.galleries && 
              currentUser.galleries.map(gallery => 
              <div className="relative" key={uniqueKey('user-gallery',currentUser,gallery)} >
                {/* <JsonBlock data={gallery} /> */}
                <GalleryItemView gallery={gallery}/>
              </div>
            )}
          </div>
        </div>
      )}
      {/* BOOKS */}
      {activeTab === "Books" && (
        <div>
          <h2 className="subtitle">Books</h2>
          <div className="bg-base-100 my-4 p-4 rounded-md">
            TBD
          </div>
        </div>
      )}
      {/* POSTS */}
      {activeTab === "Posts" && (
        <>
          <h2 className="subtitle">Posts</h2>
          <div className="my-4">
          {currentUser?.posts &&
            currentUser?.posts.map((post) => (
              <UserDetailPostItem post={post} key={uniqueKey('user-post',currentUser, post)} />
            ))}
          </div>
        </>
      )}
      {/* FOLLOWERS */}
      {activeTab === "Follow" && (
        <div className="bg-base-300 rounded-md p-4 my-4 grid grid-cols-2 gap-2">
        <div className="col-span-1">
          <h2 className="h-subtitle">Followers</h2>
          <div className="flex space-x-2 space-y-2">
            {followers.map((follow:UserFollow) => (
              <Avatar user={follow} sz='md' key={uniqueKey(currentUser, follow)} />
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="h-subtitle">Follows</h2>
          <div className="flex space-x-2 space-y-2">
            {follows.map((follow:UserFollow) => (
              <Avatar user={follow} sz='md' key={uniqueKey(currentUser, follow)} />
            ))}
          </div>
        </div>
      </div>
      )}
      {/* FANS */}
      {activeTab === "Fan" && (
        <div className="bg-base-300 rounded-md p-4 my-4 grid grid-cols-2 gap-2">
        <div className="col-span-1">
          <h2 className="h-subtitle">Fans</h2>
          <div className="flex space-x-2 space-y-2">
            {fans.map((follow:UserFollow) => (
              <Avatar user={follow} sz='md' key={uniqueKey(currentUser, follow)}/>
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="h-subtitle">Stans</h2>
          <div className="flex space-x-2 space-y-2">
            {stans.map((follow:UserFollow) => (
              <Avatar user={follow} sz='md' key={uniqueKey(currentUser, follow)}/>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default UserDetailComponent;
