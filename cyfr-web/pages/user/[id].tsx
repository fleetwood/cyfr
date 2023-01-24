import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { TabPanel } from "react-tabs"
import UserDetailPostItem from "../../components/containers/Post/UserDetailPostItem"
import UserDetailFan from "../../components/containers/User/UserDetailFan"
import UserDetailFollow from "../../components/containers/User/UserDetailFollow"
import { useToast } from "../../components/context/ToastContextProvider"
import MainLayout from "../../components/layouts/MainLayout"
import Tabby from "../../components/ui/Tabby"
import Avatar from "../../components/ui/avatar"
import { FireIcon, HeartIcon } from "../../components/ui/icons"
import ShrinkableIconButton from "../../components/ui/shrinkableIconButton"
import useCyfrUser from "../../hooks/useCyfrUser"
import useUserDetail from "../../hooks/useUserDetail"
import { uuid } from "../../utils/helpers"
import { log } from "../../utils/log"

export async function getServerSideProps(context: any) {
  const userId = context.params.id
  return {
    props: {
      userId,
    },
  }
}

type UserDetailProps = {
  userId: string
}

const UserDetailPage = ({ userId }: UserDetailProps) => {
  const router = useRouter()
  const [cyfrUser] = useCyfrUser()
  const {currentUser, follow, stan, invalidateUser} = useUserDetail(userId)
  const {notify} = useToast()
  const [invalidateTabs, setInvalidateTabs] = useState(false)

  const followUser = async () => {
    if (!cyfrUser || !currentUser) return

    const result = await follow({follower: cyfrUser.id,following: currentUser.id})
    
    if (result) {
      notify({
        message: `You are now following ${currentUser.name}!`,
        type: 'success'
      })
    }
    invalidateUser()
  }
  
  const stanUser = async () => {
    if (!cyfrUser || !currentUser) return

    const result = await stan({
      fanOfId: currentUser.id,
      fanId: cyfrUser.id
    })

    if (result) {
      notify({
        message: `You are stanning ${currentUser.name}!!! Nice!`,
        type: 'success'
      })
    }
    invalidateUser()
  }

  useEffect(() => {
    setInvalidateTabs(() => true)
  }, [currentUser])

  useEffect(() => {
    setInvalidateTabs(() => false)
  }, [invalidateTabs])

  return (
    <MainLayout
      pageTitle="User Detail"
      sectionTitle=""
      subTitle={currentUser?.name || ""}
    >      {currentUser && (
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
              <Avatar user={currentUser} sz="lg" />
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
                  <strong>Posts:</strong> {currentUser.posts.length}
                </div>
                <div>
                  <strong>Followers:</strong> {currentUser.following.length}
                </div>
                <div>
                  <strong>Follows:</strong> {currentUser.follower.length}
                </div>
                <div>
                  <strong>Fans:</strong> {currentUser.fans.length}
                </div>
                <div>
                  <strong>Stans:</strong> {currentUser.fanOf.length}
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
          {currentUser.following && currentUser.following.map((follow) => (
            <UserDetailFollow follower={follow} key={follow.id} />
          ))}
          {currentUser.fans && currentUser.fans.map((fan) => (
            <UserDetailFan fan={fan.fan} key={fan.id} />
          ))}
          <Tabby defaultIndex={0} invalidate={invalidateTabs}>
            <TabPanel title="Posts" key={uuid()}>
                {currentUser.posts && currentUser.posts.map((post) => (
                  <UserDetailPostItem post={post} key={post.id} />
                ))}
            </TabPanel>
            <TabPanel title="Follows" key={uuid()} className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Followers</h2>
                  {currentUser.following && currentUser.following.map((follow) => (
                    <UserDetailFollow follower={follow} key={follow.id} />
                  ))}
                </div>
                <div>
                  <h2>Following</h2>
                  {currentUser.follower && currentUser.follower.map((follow) => (
                    <UserDetailFollow following={follow} key={follow.id} />
                  ))}
                </div>
            </TabPanel>
            <TabPanel title="fans" key={uuid()} className="flex flex-col sm:flex-row justify-evenly">
                <div>
                  <h2>Fans</h2>
                  {currentUser.fans && currentUser.fans.map((fan) => (
                    <UserDetailFan fan={fan.fan} key={fan.id} />
                  ))}
                </div>
                <div>
                  <h2>Stans</h2>
                  {currentUser.fanOf && currentUser.fanOf.map((fan) => (
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

export default UserDetailPage
