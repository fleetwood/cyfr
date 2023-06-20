import { GetSessionParams, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

import UserBillingDetail from "components/containers/User/UserBillingDetail"
import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { Dropzone, TailwindInput } from "components/forms"
import MainLayout from "components/layouts/StaticLayout"
import { SaveIcon } from "components/ui/icons"
import useDebug from "hooks/useDebug"
import { useSession } from "lib/next-auth-react-query"
import { CyfrUser, Image, PrismaUser } from "prisma/prismaContext"
import { cloudinary } from "utils/cloudinary"
import UserDetailPage from "./user/[id]"
import Tabs from "components/ui/tabs"
const {debug, info} = useDebug('pages/account')

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const user = await PrismaUser.userInSessionContext(context)
  
  return { props: { user } }
}

type AccountProps = {
  user?: CyfrUser | undefined
}

const Account = ({user}: AccountProps) => {
  const [session] = useSession({required: true, redirectTo: '/login'})  
  const [cyfrUser, isLoading, error, invalidate] = useCyfrUserContext()
  const [activeTab, setActiveTab] = useState('Preferences' )
  const [cyfrName, setCyfrName] = useState<string|null>(null)

  const onNameChange = () => {
    if (cyfrName===null||cyfrName.length<3) {
      return
    }
    const newCyfrUser = {
      ...cyfrUser,
      name: cyfrName
    } as unknown as CyfrUser
    // updateUser(newCyfrUser)
    //   .then(r => {
    //     debug(`onNameChange complete`)
    //     invalidate()
    //   })
    //   .catch(e => {
    //     info(`onNameChange error`,e)
    //   })
  }

  const onFileComplete = async (files:Image[]) => {
    const file = files[0]
    if (files[0]) {
      debug(`onFileComplete`,file)
      const newCyfrUser = {
        ...cyfrUser,
        image: files[0].url
      } as unknown as CyfrUser
      // const result = await updateUser(newCyfrUser)
      // if (result) {
      //   invalidateUser()
      // }
      // else {
      //   info(`onFileComplete error`,{file})
      // }
    }
  }

  const activeTabClass = (tab:string) => activeTab === tab 
    ? `btn-secondary rounded-b-none mt-0`
    : `btn-primary -mt-1`

  useEffect(() => {
    if (cyfrUser) {
      setCyfrName(cyfrUser.name)
    }
  }, [cyfrUser])

  useEffect(() => {
    const tab = window.location.hash
    if (tab && tab.length > 0) {
      setActiveTab(tab)
    } else {
      debug('useEffect', {hash: `Ain't no hash ${window.location}`})
    }
  }, [])

  return (
    <MainLayout sectionTitle="Account" >
      {cyfrUser &&  <>
        <button className="btn btn-secondary my-12" onClick={() => signOut()}>
          Logout
        </button>

        <Tabs variant="buttons">
          <>
            <span>Preferences</span>
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
            <span>User</span>
            <div className="mt-12">
              <UserDetailPage userId={cyfrUser.id} layout="none" />
            </div>
          </>
        </Tabs>
        
      </>}
    </MainLayout>
  )
}

export default Account
