import { useState } from "react";
import useUserDetail from "../../../hooks/useUserDetail";
import { useToast } from "../../context/ToastContextProvider";
import Avatar from "../../ui/avatar";
import { HeartIcon, FireIcon } from "../../ui/icons";
import ShrinkableIconButton from "../../ui/shrinkableIconButton";
import UserDetailPostItem from "../Post/UserDetailPostItem";
import useCyfrUser from "../../../hooks/useCyfrUser";
import GalleryItemView from "../Gallery/GalleryItemView";
import GalleryCreateView from "../Gallery/GalleryCreateView";
import GalleryDetailView from "../Gallery/GalleryDetailView";
import { uuid, uniqueKey } from '../../../utils/helpers';
import { cloudinary } from '../../../utils/cloudinary';

type UserDetailComponentProps = {
  userId: String;
};

const UserDetailComponent = ({ userId }: UserDetailComponentProps) => {
  const [cyfrUser] = useCyfrUser();
  const { currentUser, follow, stan, invalidateUser } = useUserDetail({
    id: userId,
  });
  const { notify } = useToast();
  const [activeTab, setActiveTab] = useState("Posts");

  const activeTabClass = (tab: string) =>
    activeTab === tab
      ? `btn-secondary rounded-b-none mt-0`
      : `btn-primary -mt-1`;

  const followUser = async () => {
    if (!cyfrUser || !currentUser) return;

    const result = await follow({
      follower: cyfrUser.id,
      following: currentUser.id,
    });

    if (result) {
      notify({
        message: `You are now following ${currentUser.name}!`,
        type: "success",
      });
    }
    invalidateUser();
  };

  const stanUser = async () => {
    if (!cyfrUser || !currentUser) return;

    const result = await stan({
      fanOfId: currentUser.id,
      fanId: cyfrUser.id,
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
        <img src={currentUser.image||''} className="-mt-2 mb-2 rounded-lg min-w-full" />
      }
      <div
        className="
        grid grid-cols-9
        mx-2 mb-4
        md:mx-4 md:mb-8
        md:p-4
        rounded-lg p-2 
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
              <strong>Posts:</strong> {currentUser?.posts.length}
            </div>
            <div>
              <strong>Followers:</strong> {currentUser?.following.length}
            </div>
            <div>
              <strong>Follows:</strong> {currentUser?.follower.length}
            </div>
            <div>
              <strong>Fans:</strong> {currentUser?.fans.length}
            </div>
            <div>
              <strong>Stans:</strong> {currentUser?.fanOf.length}
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
              onClick={followUser}
            />
            <ShrinkableIconButton
              label="Fan"
              icon={FireIcon}
              className="bg-opacity-0 hover:shadow-none"
              iconClassName="text-primary"
              labelClassName="text-primary"
              onClick={stanUser}
            />
          </div>
        </div>
      </div>

      {/* TAB BUTTONS */}
      <div className="border-b-8 border-secondary flex justify-between space-x-2">
        <button
          className={`btn ${activeTabClass("Posts")} w-[20%]`}
          onClick={() => setActiveTab("Posts")}
        >
          Posts
        </button>
        <button
          className={`btn ${activeTabClass("Galleries")} w-[20%]`}
          onClick={() => setActiveTab("Galleries")}
        >
          Galleries
        </button>
        <button
          className={`btn ${activeTabClass("Follow")} w-[20%]`}
          onClick={() => setActiveTab("Follow")}
        >
          Follow
        </button>
        <button
          className={`btn ${activeTabClass("Fan")} w-[20%]`}
          onClick={() => setActiveTab("Fan")}
        >
          Fan
        </button>
      </div>

      {/* GALLERIES */}
      {activeTab === "Galleries" && (
        <div className="flex flex-col space-y-4">
          {currentUser?.id === cyfrUser.id &&
            <GalleryCreateView />
          }
          {currentUser?.galleries.map(gallery => 
            <div className="relative" key={uniqueKey('user-gallery',currentUser,gallery)} >
                <GalleryItemView gallery={gallery}/>
            </div>
        )}
        </div>
      )}
      {/* POSTS */}
      {activeTab === "Posts" && (
        <>
          <h2 className="subtitle">Posts</h2>
          {currentUser?.posts &&
            currentUser?.posts.map((post) => (
              <UserDetailPostItem post={post} key={uniqueKey('user-post',currentUser, post)} />
            ))}
        </>
      )}
      {/* FOLLOWERS */}
      {activeTab === "Follow" && (
        <div>
          <h2 className="subtitle">Follows</h2>
          {currentUser?.follower &&
            currentUser?.follower.map((f) => (
              <Avatar
                user={f.following}
                sz="md"
                key={uniqueKey('user-following',currentUser,f.following)}/>
            ))}
          <h2 className="subtitle">Followers</h2>
          {currentUser?.following &&
            currentUser?.following.map((f) => (
              <Avatar
                user={f.follower}
                sz="md"
                key={uniqueKey('user-follower',currentUser,f.follower)}/>
            ))}
        </div>
      )}
      {/* FANS */}
      {activeTab === "Fan" && (
        <div>
          <h2 className="subtitle">Fans</h2>
          {currentUser?.fans &&
            currentUser?.fans.map((f) => (
              <Avatar user={f.fan} sz="md" 
              key={uniqueKey('user-fan',currentUser,f.fan)}/>
            ))}
          <h2 className="subtitle">Stan</h2>
          {currentUser?.fanOf &&
            currentUser?.fanOf.map((f) => (
              <Avatar
                user={f.fanOf}
                sz="md"
                key={uniqueKey('user-stan',currentUser,f.fanOf)}/>
            ))}
        </div>
      )}
    </div>
  );
};

export default UserDetailComponent;
