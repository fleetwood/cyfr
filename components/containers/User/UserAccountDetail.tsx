import { useState } from "react"
import useUserDetail, { UserDetailHookProps } from "../../../hooks/useUserDetail"
import Avatar from "../../ui/avatar"

const UserAccountDetail = ({ user, id }: UserDetailHookProps) => {
  const { currentUser, invalidateUser } = useUserDetail({user, id})
  const [activeTab, setActiveTab] = useState('Posts')
  const activeTabClass = (tab:string) => activeTab === tab 
    ? `btn-secondary rounded-b-none mt-0`
    : `btn-primary -mt-1`

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
              </div>
            </div>
          </div>
          
          
        <div className="border-b-8 border-secondary flex justify-between space-x-2">
          <button className={`btn ${activeTabClass('Posts')} w-[30%]`} onClick={() => setActiveTab("Posts")}>Posts</button>
          <button className={`btn ${activeTabClass('Follows')} w-[30%]`} onClick={() => setActiveTab("Follows")}>Follows</button>
          <button className={`btn ${activeTabClass("Fans")} w-[30%]`} onClick={() => setActiveTab("Fans")}>Fans</button>
        </div>

        {activeTab==="Posts" &&
          <div className="bg-base-300 rounded-md p-4 mt-4">
             {/* {currentUser.posts.map((post: PostWithDetails) => (
                  <UserDetailPostItem post={post} key={post.id} />
              ))} */}
          </div>
        }

        {activeTab==="Follows" &&
          <div className="bg-base-300 rounded-md p-4 mt-4">
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
          </div>
        }

        {activeTab==="Fans" &&
          <div className="bg-base-300 rounded-md p-4 mt-4">
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
          </div>
        }
        </>
      )}
    </div>
  )
}

export default UserAccountDetail
