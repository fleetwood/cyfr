import { GetSessionParams, signOut } from "next-auth/react"
import { useEffect, useState } from "react"

import { InferGetServerSidePropsType } from "next"
import UserBillingDetail from "../components/containers/User/UserBillingDetail"
import { useCyfrUserContext } from "../components/context/CyfrUserProvider"
import Dropzone, { CompleteFile } from "../components/forms/Dropzone"
import TailwindInput from "../components/forms/TailwindInput"
import MainLayout from "../components/layouts/MainLayout"
import { SaveIcon } from "../components/ui/icons"
import { useCyfrUserApi } from "../hooks/useCyfrUser"
import useDebug from "../hooks/useDebug"
import { useSession } from "../lib/next-auth-react-query"
import { PrismaUser } from "../prisma/entities/prismaUser"
import { CyfrUser } from "../prisma/types/user.def"
import { cloudinary } from "../utils/cloudinary"
import UserDetailPage from "./user/[id]"
import { User } from "../prisma/prismaContext"
const {debug, info} = useDebug('pages/account', 'DEBUG')

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const user = await PrismaUser.userInSessionContext(context)
  
  return { props: { user } }
}

type AccountProps = {
  user?: CyfrUser | undefined
}

const Account = ({user}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [session] = useSession({required: true, redirectTo: '/login'})  
  const [cyfrUser] = useCyfrUserContext()
  const {updateUser, invalidateUser}=useCyfrUserApi()
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
    updateUser(newCyfrUser)
      .then(r => {
        debug(`onNameChange complete`)
        invalidateUser()
      })
      .catch(e => {
        info(`onNameChange error`,e)
      })
  }

  const onFileComplete = async (files:CompleteFile[]) => {
    const file = files[0]
    if (file.secure_url) {
      debug(`onFileComplete`,file)
      const newCyfrUser = {
        ...cyfrUser,
        image: file.secure_url
      } as unknown as CyfrUser
      const result = await updateUser(newCyfrUser)
      if (result) {
        invalidateUser()
      }
      else {
        info(`onFileComplete error`,{file})
      }
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
        
        <div className="border-b-8 border-secondary flex justify-between space-x-2">
          <button className={`btn ${activeTabClass('Preferences')} w-[30%]`} onClick={() => setActiveTab("Preferences")}>Preferences</button>
          <button className={`btn ${activeTabClass('Billing')} w-[30%]`} onClick={() => setActiveTab("Billing")}>Billing</button>
          <button className={`btn ${activeTabClass("User")} w-[30%]`} onClick={() => setActiveTab("User")}>User</button>
        </div>

        {activeTab==="Preferences" &&
          <div className="bg-base-300 rounded-md p-4 mt-4">
            <TailwindInput label="Display Name" type="text" inputClassName="input input-bordered focus:border-primary" value={cyfrName} setValue={setCyfrName} />
            <button className="btn btn-primary btn-sm" onClick={onNameChange}>{SaveIcon}</button>
            <h3 className="h-title">Avatar</h3>
            <Dropzone onUploadComplete={onFileComplete} limit={1} >
              <img src={cloudinary.resize({url: cyfrUser.image!, width: 200})} />
            </Dropzone>
          </div>
        }
        
        {activeTab==="Billing" &&
          <UserBillingDetail />
        }
              
        {activeTab==="User" &&
          <div className="mt-12">
            <UserDetailPage userId={cyfrUser.id} layout="none" />
          </div>
        }

      </>}
    </MainLayout>
  )
}

export default Account
