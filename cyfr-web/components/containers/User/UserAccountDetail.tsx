import { TabPanel } from "react-tabs"
import useUserDetailApi from "../../../hooks/useUserDetailApi"
import Tabby from "../../ui/Tabby"
import Avatar from "../../ui/avatar"
import UserDetailPostItem from "../Post/UserDetailPostItem"
import UserDetailFollow from "./UserDetailFollow"
import UserDetailFan from "./UserDetailFan"
import { UserFollows, UserWithPostsLikes } from "../../../prisma/types/user"
import { PostWithDetails } from "../../../prisma/types/post"
import { Key } from "react"
import { User } from "@prisma/client"

type UserAccountDetailProps = {
  currentUser: UserWithPostsLikes
}


const UserAccountDetail = ({ currentUser }: UserAccountDetailProps) => {
  const { userDetail, error, invalidate } = useUserDetailApi(currentUser.id)

  return (
    <div className="">
      {userDetail && (
        <>
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
            <div className="col-span-2 mt-2 md:-mt-12">
              <Avatar user={userDetail} sz="lg" />
            </div>
            <div className="col-span-9">
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
                  <strong>Posts:</strong> {userDetail.posts.length}
                </div>
                <div>
                  <strong>Follows:</strong> {userDetail.following.length}
                </div>
                <div>
                  <strong>Followers:</strong> {userDetail.follower.length}
                </div>
                <div>
                  <strong>Fans:</strong> {userDetail.fans.length}
                </div>
                <div>
                  <strong>Stans:</strong> {userDetail.fanOf.length}
                </div>
              </div>
            </div>
          </div>
          <Tabby>
            <TabPanel title="Posts" className="p-2 md:p-4 min-w-fit">
                {userDetail.posts.map((post: PostWithDetails) => (
                  <UserDetailPostItem post={post} key={post.id} />
                ))}
            </TabPanel>
            <TabPanel title="Follows" className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Following</h2>
                  {userDetail.follower.map((follow:UserFollows) => (
                    <UserDetailFollow following={follow} key={follow.id} />
                  ))}
                </div>
                <div>
                  <h2>Followers</h2>
                  {userDetail.following.map((follow:UserFollows) => (
                    <UserDetailFollow follower={follow} key={follow.id} />
                  ))}
                </div>
            </TabPanel>
            <TabPanel title="Fans" className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Fans</h2>
                  {userDetail.fans.map((fan: { fan: User; id: string | undefined }) => (
                    <UserDetailFan fan={fan.fan} key={fan.id} />
                  ))}
                </div>
                <div>
                  <h2>Stans</h2>
                  {userDetail.fanOf.map((fan: { fanOf: User; id: string | undefined }) => (
                    <UserDetailFan fan={fan.fanOf} key={fan.id} />
                  ))}
                </div>
            </TabPanel>
          </Tabby>
        </>
      )}
    </div>
  )
}

export default UserAccountDetail
