import { signOut } from "next-auth/react"
import { useState } from "react"

import UserBillingDetail from "components/containers/User/UserBillingDetail"
import { UserNameAndAvatar } from "components/containers/User/UserNameAndAvatar"
import { useToast } from "components/context/ToastContextProvider"
import MainLayout from "components/layouts/StaticLayout"
import { TabClassNames } from "components/ui/tabs"
import useDebug from "hooks/useDebug"
import { useSession } from "hooks/useSession"
import UserDetailPage from "./user/[slug]"
import useApi from "prisma/useApi"
const {debug, info} = useDebug('pages/account')

const Account = () => {
  useSession({required: true, redirectTo: '/login'})
  const {cyfrUser, isLoading, error, invalidate} = useApi.cyfrUser()
  const {notify} = useToast()
  const [activeTab, setActiveTab] = useState('Preferences' )

  const activeTabClass = (tab:string) => activeTab === tab 
    ? `btn-secondary rounded-b-none mt-0`
    : `btn-primary -mt-1`

  const tabClasses:TabClassNames = {
    list: 'border-b-8 border-accent flex space-x-2',
    item: `py-2 rounded-md font-bold bg-warning text-sm text-warning-content grow mb-2`,
    selected: `p-3 rounded-t-md font-bold bg-accent text-white text-lg grow rounded-b-none -mb-2`
  }

  return (
    <MainLayout sectionTitle="Account" >
      {cyfrUser &&  <>
        <button className="btn btn-secondary my-12" onClick={() => signOut()}>
          Logout
        </button>

          <>
            <span>Profile</span>
            <UserNameAndAvatar />
          </>

          <>
            <span>Billing</span>
            <UserBillingDetail />
          </>

          <>
            <span>Stats</span>
            <div className="mt-12">
              <UserDetailPage userId={cyfrUser.id} layout="none" />
            </div>
          </>
        
      </>}
    </MainLayout>
  )
}

export default Account
