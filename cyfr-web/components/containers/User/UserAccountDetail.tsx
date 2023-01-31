import { TabPanel } from "react-tabs"
import useUserDetail from "../../../hooks/useUserDetail"
import Tabby from "../../ui/Tabby"
import Avatar from "../../ui/avatar"
import UserDetailPostItem from "../Post/UserDetailPostItem"
import UserDetailFollow from "./UserDetailFollow"
import UserDetailFan from "./UserDetailFan"
import { User } from "@prisma/client"
import { UserDetail, UserFeed } from "../../../prisma/types/user.def"

type UserAccountDetailProps = {
  user: UserDetail
}

const UserAccountDetail = ({ user }: UserAccountDetailProps) => {
  const { currentUser, invalidateUser } = useUserDetail(user.id)

  return (
    <div className="">
      {currentUser && (
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
              <Avatar user={currentUser} sz="lg" />
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
                  <strong>Posts:</strong> {currentUser.posts.length}
                </div>
                <div>
                  <strong>Follows:</strong> {currentUser.following.length}
                </div>
                <div>
                  <strong>Followers:</strong> {currentUser.follower.length}
                </div>
                <div>
                  <strong>Fans:</strong> {currentUser.fans.length}
                </div>
                <div>
                  <strong>Stans:</strong> {currentUser.fanOf.length}
                </div>
              </div>
            </div>
          </div>
          <Tabby defaultIndex={0} invalidate={false}>
            <TabPanel title="Posts" className="p-2 md:p-4 min-w-fit">
                {/* {currentUser.posts.map((post: PostWithDetails) => (
                  <UserDetailPostItem post={post} key={post.id} />
                ))} */}
            </TabPanel>
            <TabPanel title="Follows" className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Following</h2>
                  {/* {currentUser.follower.map((follow:UserFollows) => (
                    <UserDetailFollow following={follow} key={follow.id} />
                  ))} */}
                </div>
                <div>
                  <h2>Followers</h2>
                  {/* {currentUser.following.map((follow:UserFollows) => (
                    <UserDetailFollow follower={follow} key={follow.id} />
                  ))} */}
                </div>
            </TabPanel>
            <TabPanel title="Fans" className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Fans</h2>
                  {/* {currentUser.fans.map((fan: { fan: User; id: string | undefined }) => (
                    <UserDetailFan fan={fan.fan} key={fan.id} />
                  ))} */}
                </div>
                <div>
                  <h2>Stans</h2>
                  {/* {currentUser.fanOf.map((fan: { fanOf: User; id: string | undefined }) => (
                    <UserDetailFan fan={fan.fanOf} key={fan.id} />
                  ))} */}
                </div>
            </TabPanel>
          </Tabby>
        </>
      )}
    </div>
  )
}

export default UserAccountDetail
