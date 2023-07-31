import { Grid } from "@mui/material"
import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { useToast } from "components/context/ToastContextProvider"
import Avatar from "components/ui/avatar/avatar"
import { FireIcon, HeartIcon } from "components/ui/icons"
import JsonBlock from "components/ui/jsonBlock"
import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import { BookStub, FollowStub, GalleryStub, PostStub, UserFollow, UserStub } from "prisma/prismaContext"
import useApi from "prisma/useApi"
import { useState } from "react"
import { abbrNum, uniqueKey } from 'utils/helpers'
import PostStubView from "../Post/PostStubView"
import BookCover from "../Books/BookCover"
import GalleryStubView from "../Gallery/GalleryStubView"

type UserDetailViewProps = {slug: string}
const UserDetailView = ({slug}:UserDetailViewProps) => {
  const {cyfrUser} = useApi.cyfrUser()
  const {query, followUser } = useApi.user()

  const {data: currentUser, isLoading, error, invalidate} = query({slug})
  const followers = currentUser?.following.filter(f => f.isFan === false) ?? []
  const fans = currentUser?.following.filter(f => f.isFan === true) ?? []
  const following = currentUser?.follower.filter(f => f.isFan === false) ?? []
  const stans = currentUser?.follower.filter(f => f.isFan === true) ?? []
  
  const { notify, notifyNotImplemented, notifyError } = useToast()
  const [activeTab, setActiveTab] = useState("Posts")

  const activeTabClass = (tab: string) =>
    activeTab === tab
      ? `btn-secondary rounded-b-none mt-0`
      : `btn-primary -mt-1`

  const clickFollow = async () => {
    const result = await followUser({
      followerId: cyfrUser.id,
      followingId: currentUser.id,
      isFan: false
    })

    if (result) {
      notify(`You are now following ${currentUser.name}!`,"success",)
    } else {
      notifyError()
    }
    invalidate()
  }

  const clickStan = async () => {
    if (!cyfrUser || !currentUser) return

    const result = await followUser({
      followerId: cyfrUser.id,
      followingId: currentUser.id,
      isFan: true
    })

    if (result) {
      notify(`You are stanning ${currentUser.name}!!! Nice!`,"success")
    } else {
      notifyError()
    }
    invalidate()
  }

  return (
    <div>
      {currentUser &&
        <img src={currentUser.image||''} className="-mt-2 mb-2 rounded-md min-w-full" />
      }
      <Grid>
          <Grid>
            <strong>Posts:</strong> {(currentUser?.posts||[]).length}
          </Grid>
          <div>
            <strong>Followers:</strong> ({followers.length})
          </div>
          <div>
            <strong>Fans:</strong> ({fans.length})
          </div>
          <div>
            <strong>Follows:</strong> ({following.length})
          </div>
          <div>
            <strong>Stans:</strong> ({stans.length})
          </div>
          <ShrinkableIconButton
              label={`Followers (${abbrNum(followers.length)})`}
              icon={HeartIcon}
              className="bg-opacity-0 hover:shadow-none"
              iconClassName="text-primary"
              labelClassName="text-primary"
              onClick={clickFollow}
            />
          <ShrinkableIconButton
            label={`Fans (${abbrNum(fans.length)})`}
            icon={FireIcon}
            className="bg-opacity-0 hover:shadow-none"
            iconClassName="text-primary"
            labelClassName="text-primary"
            onClick={clickStan}
          />
      </Grid>

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
          className={`btn ${activeTabClass("Followers")} w-[15%]`}
          onClick={() => setActiveTab("Followers")}
        >
          Followers
        </button>
        <button
          className={`btn ${activeTabClass("Following")} w-[15%]`}
          onClick={() => setActiveTab("Following")}
        >
          Following
        </button>
      </div>

      {/* GALLERIES */}
      {activeTab === "Galleries" && (
        <div className="flex flex-col space-y-4 my-4">
          <h2 className="subtitle">Galleries ({abbrNum(currentUser?.galleries?.length??0)})</h2>
          <div className="bg-base-100 my-4 p-4 rounded-md">
            {currentUser?.galleries && 
              currentUser.galleries.map((gallery: GalleryStub) => 
              <div className="relative" key={uniqueKey('user-gallery',currentUser,gallery)} >
                <GalleryStubView gallery={gallery}/>
              </div>
            )}
          </div>
        </div>
      )}
      {/* BOOKS */}
      {activeTab === "Books" && (
        <div className="flex flex-col space-y-4 my-4">
          <h2 className="subtitle">Books ({abbrNum(currentUser?.books?.length??0)})</h2>
          <div className="bg-base-100 my-4 p-4 rounded-md">
            {currentUser?.books?.map((book:BookStub) => (
              <BookCover book={book} key={book.id} />
            ))}
          </div>
        </div>
      )}
      {/* POSTS */}
      {activeTab === "Posts" && (
        <div className="flex flex-col space-y-4 my-4">
          <h2 className="subtitle">Posts ({abbrNum(currentUser?.posts?.length??0)})</h2>
          <div className="bg-base-100 my-4 p-4 rounded-md">
          {currentUser?.posts?.map((post:PostStub) => (
              <PostStubView post={post} key={post.id} />
          ))}
          </div>
        </div>
      )}
      {/* FOLLOWERS */}
      {activeTab === "Followers" && (
        <div className="bg-base-300 rounded-md p-4 my-4 grid grid-cols-2 gap-2">
        <div className="col-span-1">
          <h2 className="h-subtitle">Fans</h2>
          <div className="flex space-x-2 space-y-2">
            {fans.map((follow:FollowStub) => (
              <Avatar user={follow.follower} sz='md' key={uniqueKey(currentUser, follow)} />
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="h-subtitle">Followers</h2>
          <div className="flex space-x-2 space-y-2">
            {followers.map((follow:FollowStub) => (
              <Avatar user={follow.follower} sz='md' key={uniqueKey(currentUser, follow)} />
            ))}
          </div>
        </div>
      </div>
      )}
      {/* FANS */}
      {activeTab === "Following" && (
        <div className="bg-base-300 rounded-md p-4 my-4 grid grid-cols-2 gap-2">
        <div className="col-span-1">
          <h2 className="h-subtitle">Stans</h2>
          <div className="flex space-x-2 space-y-2">
            {stans.map((follow:FollowStub) => (
              <Avatar user={follow.following} sz='md' key={uniqueKey(currentUser, follow)} />
            ))}
          </div>
        </div>
        <div className="col-span-1">
          <h2 className="h-subtitle">Following</h2>
          <div className="flex space-x-2 space-y-2">
            {following.map((follow:FollowStub) => (
              <Avatar user={follow.following} sz='md' key={uniqueKey(currentUser, follow)} />
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  )
}

export default UserDetailView
