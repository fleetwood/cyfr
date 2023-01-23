import { useEffect, useState } from "react"
import UserAccountDetail from "../components/containers/User/UserAccountDetail"
import MainLayout from "../components/layouts/MainLayout"
import useCyfrUser from "../hooks/useCyfrUser"
import { GetSessionParams, signOut } from "next-auth/react"
import { useSession } from "../lib/next-auth-react-query"
import { UserWithPostsLikes } from "../prisma/types/user"
import { Users } from "../prisma/users"
import Tabby from "../components/ui/Tabby"
import { TabPanel } from "react-tabs"
import { log } from "../utils/log"
import { __cyfr_refetch__ } from "../utils/constants"

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const user = await Users.userInSession(context)
  
  return { props: { user } }
}

type AccountProps = {
  user?: UserWithPostsLikes | undefined
}

const Account = ({user}:AccountProps) => {
  const [session] = useSession({required: true, redirectTo: '/login'})
  const {cyfrUser, setCyfrUser, invalidateUser, setRefetchInterval} = useCyfrUser()

  useEffect(() => {
    setRefetchInterval(!cyfrUser ? session ? 100 : __cyfr_refetch__ : __cyfr_refetch__)
  },[cyfrUser])

  return (
    <MainLayout sectionTitle="Account" subTitle={cyfrUser?.name || ''}>
      {cyfrUser &&  <>
        <button className="btn btn-secondary my-12" onClick={() => signOut()}>
          Logout
        </button>
        <Tabby defaultIndex={0}>
          <TabPanel title="Preferences">
            <h2 className="subtitle">Preferences</h2>
          </TabPanel>
          <TabPanel title="Billing">
            <h2 className="subtitle">Billing</h2>
          </TabPanel>
          <TabPanel title="User">
            <div className="mt-12">
              <UserAccountDetail currentUser={cyfrUser} />
            </div>
          </TabPanel>
        </Tabby>
      </>}
    </MainLayout>
  )
}

export default Account
