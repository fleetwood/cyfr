import { useState } from "react"
import { PostStub, UserDetail, UserFollow } from "prisma/prismaContext"
import userApi from "prisma/useApi/user"
import UserAvatar from "components/ui/avatar/userAvatar"
import PostStubView from "../Post/PostStubView"

const UserAccountDetail = (user:UserDetail) => {

  const {query } = userApi()
  const {data, isLoading, error, invalidate} = query({slug: user!.slug??user!.name!})
  const currentUser:UserDetail = data
  const [activeTab, setActiveTab] = useState('Posts')
  const activeTabClass = (tab:string) => activeTab === tab 
    ? `btn-secondary rounded-b-none mt-0`
    : `btn-primary -mt-1`

  return (
    <div className="">
      {currentUser && (
        <>
          <div className="grid grid-cols-9 mx-2 mb-4 md:mx-4 md:mb-8 md:p-4 rounded-lg p-2 bg-base-100 bg-opacity-20 text-neutral-content">
            <div className="col-span-2 mt-2 md:-mt-12">
              <UserAvatar user={currentUser} sz="lg" />
            </div>
            <div className="col-span-9">
              <div className="flex items-start flex-col md:flex-row justify-between h-[50%]">
                <div>
                  <strong>Posts:</strong> {currentUser._count.posts}
                </div>
                <div>
                  <strong>Followers:</strong> {currentUser.follower.length}
                </div>
                <div>
                  <strong>Follows:</strong> {currentUser.following.length}
                </div>
                <div>
                  <strong>Fans:</strong> (NI)
                </div>
                <div>
                  <strong>Stans:</strong> (NI)
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
            {currentUser.posts.map((post: PostStub) => (
              <PostStubView post={post} key={post.id} />
            ))}
          </div>
        }

        {activeTab==="Follows" &&
          <div className="bg-base-300 rounded-md p-4 mt-4 grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <h2 className="h-subtitle">Followers</h2>
            <div className="flex space-x-2 space-y-2">
              {/* {followers.map((follow:UserFollow) => (
                <Avatar user={follow} sz='md' />
              ))} */}
            </div>
          </div>
          <div className="col-span-1">
            <h2 className="h-subtitle">Follows</h2>
            <div className="flex space-x-2 space-y-2">
              {/* {follows.map((follow:UserFollow) => (
                <Avatar user={follow} sz='md' />
              ))} */}
            </div>
          </div>
        </div>
        }

        {activeTab==="Fans" &&
         <div className="bg-base-300 rounded-md p-4 mt-4 grid grid-cols-2 gap-2">
         <div className="col-span-1">
           <h2 className="h-subtitle">Fans</h2>
           <div className="flex space-x-2 space-y-2">
             {/* {fans.map((follow:UserFollow) => (
               <Avatar user={follow} sz='md' />
             ))} */}
           </div>
         </div>
         <div className="col-span-1">
           <h2 className="h-subtitle">Stans</h2>
           <div className="flex space-x-2 space-y-2">
             {/* {stans.map((follow:UserFollow) => (
               <Avatar user={follow} sz='md' />
             ))} */}
           </div>
         </div>
       </div>
        }
        </>
      )}
    </div>
  )
}

export default UserAccountDetail
