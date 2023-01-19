import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import useUserDetailApi from '../../../hooks/useUserDetailApi'
import { UserWithPostsLikes } from '../../../prisma/users'
import Avatar from '../../ui/avatar'
import UserDetailPostItem from '../Post/UserDetailPostItem'
import UserDetailFan from './UserDetailFan'
import UserDetailFollow from './UserDetailFollow'

type UserAccountDetailProps = {
    currentUser: UserWithPostsLikes
}

const UserAccountDetail = ({currentUser}:UserAccountDetailProps) => {
    const {userDetail, error, invalidate} = useUserDetailApi(currentUser.id)

  return (
    <div className=''>
        {userDetail && <>
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
              <div className="
                flex items-start
                flex-col
                md:flex-row
                justify-between
                h-[50%]
                ">
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
          <Tabs defaultIndex={0}>
            <TabList className="flex justify-around">
              <Tab>
                <button className="btn btn-primary">Posts</button>
              </Tab>
              <Tab>
                <button className="btn btn-primary">Follows</button>
              </Tab>
              <Tab>
                <button className="btn btn-primary">Fans</button>
              </Tab>
            </TabList>

            <TabPanel>
              <div className="p-2 md:p-4 min-w-fit rounded-lg text-base-content">
                {userDetail.posts.map((post) => (
                  <UserDetailPostItem post={post} key={post.id} />
                ))}
              </div>
            </TabPanel>
            <TabPanel>
              <div className="p-2 md:p-4 min-w-fit rounded-lg text-base-content flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Following</h2>
                  {userDetail.follower.map((follow) => (
                    <UserDetailFollow following={follow} key={follow.id} />
                  ))}
                </div>
                <div>
                  <h2>Followers</h2>
                  {userDetail.following.map((follow) => (
                    <UserDetailFollow follower={follow} key={follow.id} />
                  ))}
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="p-2 md:p-4 min-w-fit rounded-lg text-base-content flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Fans</h2>
                  {userDetail.fans.map((fan) => (
                    <UserDetailFan fan={fan.fan} key={fan.id} />
                  ))}
                </div>
                <div>
                  <h2>Stans</h2>
                  {userDetail.fanOf.map((fan) => (
                    <UserDetailFan fan={fan.fanOf} key={fan.id} />
                  ))}
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </>}
    </div>
  )
}

export default UserAccountDetail