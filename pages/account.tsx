import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"

import UserBillingDetail from "components/containers/User/UserBillingDetail"
import { useToast } from "components/context/ToastContextProvider"
import { Dropzone, TailwindInput } from "components/forms"
import MainLayout from "components/layouts/StaticLayout"
import { SaveIcon } from "components/ui/icons"
import { TabClassNames } from "components/ui/tabs"
import useDebug from "hooks/useDebug"
import { useSession } from "lib/next-auth-react-query"
import { useCyfrUserApi } from "prisma/hooks/useCyfrUserApi"
import { CyfrUser, Image } from "prisma/prismaContext"
import { cloudinary } from "utils/cloudinary"
import UserDetailPage from "./user/[id]"
const {debug, info} = useDebug('pages/account')

const Account = () => {
  useSession({required: true, redirectTo: '/login'})
  const {cyfrUser, isLoading, error, invalidate} = useCyfrUserApi()
  const {notify} = useToast()
  const {updateUser} = useCyfrUserApi()
  const [activeTab, setActiveTab] = useState('Preferences' )
  const [cyfrName, setCyfrName] = useState<string|null>(cyfrUser?.name)

  const onNameChange = async () => {
    if (cyfrName===null||cyfrName.length<3) {
      return
    }
    const newCyfrUser = {
      ...cyfrUser,
      name: cyfrName
    } as unknown as CyfrUser
    const result = await updateUser(newCyfrUser)
    if (result) {
      notify('Updated!')
      invalidate()
    } else {
      notify('Ya that dint work sry', 'warning')
    }
  }

  const onFileComplete = async (files:Image[]) => {
    const file = files[0]
    if (files[0]) {
      debug(`onFileComplete`,file)
      const newCyfrUser = {
        ...cyfrUser,
        image: files[0].url
      } as unknown as CyfrUser
      const result = await updateUser(newCyfrUser)
      if (result) {
        notify('Updated!')
        invalidate()
      } else {
        notify('Ya that dint work sry', 'warning')
      }
    }
  }

  useEffect(() => {
    if (cyfrUser) {
      setCyfrName(() => cyfrUser.name)
    }
  }, [isLoading])

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
            <div className="bg-base-300 rounded-md p-4 mt-4">
              <TailwindInput label="Display Name" type="text" inputClassName="input input-bordered focus:border-primary" value={cyfrName} setValue={setCyfrName} />
              <button className="btn btn-primary btn-sm" onClick={onNameChange}>{SaveIcon}</button>
              <h3 className="h-title">Avatar</h3>
              <Dropzone onDropComplete={onFileComplete} limit={1} >
                <img src={cloudinary.resize({url: cyfrUser.image!, width: 200})} />
              </Dropzone>
            </div>
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
