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
import Dropzone from "../components/forms/Dropzone"

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const user = await Users.userInSession(context)
  
  return { props: { user } }
}

type AccountProps = {
  user?: UserWithPostsLikes | undefined
}

const Account = ({user}:AccountProps) => {
  const [session] = useSession({required: true, redirectTo: '/login'})
  const [cyfrUser] = useCyfrUser()

  return (
    <MainLayout sectionTitle="Account" >
      {cyfrUser &&  <>
        <button className="btn btn-secondary my-12" onClick={() => signOut()}>
          Logout
        </button>
        <Tabby defaultIndex={0} invalidate={false}>
          <TabPanel title="Preferences">
            <div className="bg-base-300 rounded-md p-4 mt-4">
              <h2 className="h-title">Avatar</h2>
              <Dropzone allowed='img'/>
            </div>
          </TabPanel>
          <TabPanel title="Billing">
            <h2 className="subtitle">Billing</h2>
          </TabPanel>
          <TabPanel title="User">
            <div className="mt-12">
              <UserAccountDetail user={cyfrUser} />
            </div>
          </TabPanel>
        </Tabby>
      </>}
    </MainLayout>
  )
}

export default Account
