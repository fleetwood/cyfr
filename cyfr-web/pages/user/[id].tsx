import { useContext } from "react"
import { TabPanel } from "react-tabs"
import UserDetailPostItem from "../../components/containers/Post/UserDetailPostItem"
import UserDetailFan from "../../components/containers/User/UserDetailFan"
import UserDetailFollow from "../../components/containers/User/UserDetailFollow"
import { ToastContext } from "../../components/context/ToastContextProvider"
import MainLayout from "../../components/layouts/MainLayout"
import Tabby from "../../components/ui/Tabby"
import Avatar from "../../components/ui/avatar"
import { FireIcon, HeartIcon } from "../../components/ui/icons"
import ShrinkableIconButton from "../../components/ui/shrinkableIconButton"
import useCyfrUser from "../../hooks/useCyfrUser"
import { UserDetail } from "../../prisma/types/user"
import { Users } from "../../prisma/users"
import { sendApi } from "../../utils/api"
import { log, todo } from "../../utils/log"

export async function getServerSideProps(context: any) {
  const userId = context.params.id
  const user = await Users.byId(userId)

  return {
    props: {
      user,
    },
  }
}

type UserDetailProps = {
  user: UserDetail
}

const UserDetail = ({ user }: UserDetailProps) => {
  const {cyfrUser, invalidateUser }= useCyfrUser()
  const {notify} = useContext(ToastContext)

  const followUser = async () => {
    todo('Toast results and Invalidate user')
    todo('Move this functionality to a provider?')
    if (!cyfrUser) {
      log('User is not logged in???')
      return
    }
    const follow = await sendApi(`user/follow`, {
      following: user.id,
      follower: cyfrUser.id
    })
    
    if (follow) {
      notify({
        message: `You are now following ${user.name}!`,
        type: 'success'
      })
      invalidateUser()
    }
  }
  
  const stanUser = async () => {
    todo('Toast results and Invalidate user')
    todo('Move this functionality to a provider?')
    if (!cyfrUser) {
      log('User is not logged in???')
      return
    }
    const stan = await sendApi(`user/stan`, {
      stan: user.id,
      fan: cyfrUser.id
    })

    if (stan) {
      alert(JSON.stringify(stan))
    }
  }

  return (
    <MainLayout
      pageTitle="User Detail"
      sectionTitle=""
      subTitle={user?.name || ""}
    >
      {" "}
      {user && (
        <div>
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
              <Avatar user={user} sz="lg" />
            </div>
            <div className="col-span-7">
              <div className="
                flex items-start
                flex-col
                md:flex-row
                justify-between
                h-[50%]
                ">
                <div>
                  <strong>Posts:</strong> {user.posts.length}
                </div>
                <div>
                  <strong>Followers:</strong> {user.following.length}
                </div>
                <div>
                  <strong>Follows:</strong> {user.follower.length}
                </div>
                <div>
                  <strong>Fans:</strong> {user.fans.length}
                </div>
                <div>
                  <strong>Stans:</strong> {user.fanOf.length}
                </div>
              </div>
              <div className="
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
          <Tabby defaultIndex={0}>
            <TabPanel title="Posts">
                {user.posts.map((post) => (
                  <UserDetailPostItem post={post} key={post.id} />
                ))}
            </TabPanel>
            <TabPanel title="Follows" className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Followers</h2>
                  {user.following.map((follow) => (
                    <UserDetailFollow follower={follow} key={follow.id} />
                  ))}
                </div>
                <div>
                  <h2>Following</h2>
                  {user.follower.map((follow) => (
                    <UserDetailFollow following={follow} key={follow.id} />
                  ))}
                </div>
            </TabPanel>
            <TabPanel title="fans" className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Fans</h2>
                  {user.fans.map((fan) => (
                    <UserDetailFan fan={fan.fan} key={fan.id} />
                  ))}
                </div>
                <div>
                  <h2>Stans</h2>
                  {user.fanOf.map((fan) => (
                    <UserDetailFan fan={fan.fanOf} key={fan.id} />
                  ))}
                </div>
            </TabPanel>
          </Tabby>
        </div>
      )}
    </MainLayout>
  )
}

export default UserDetail
