import { useEffect, useState } from "react"
import UserAccountDetail from "../components/containers/User/UserAccountDetail"
import MainLayout from "../components/layouts/MainLayout"
import useCyfrUser, { useCyfrUserApi } from "../hooks/useCyfrUser"
import { GetSessionParams, signOut } from "next-auth/react"
import { useSession } from "../lib/next-auth-react-query"
import { UserWithPostsLikes } from "../prisma/types/user"
import { Users } from "../prisma/users"
import Tabby from "../components/ui/Tabby"
import { TabPanel } from "react-tabs"
import { log } from "../utils/log"
import { __cyfr_refetch__ } from "../utils/constants"
import Dropzone, { CompleteFile } from "../components/forms/Dropzone"
import Avatar from "../components/ui/avatar"
import { SaveIcon, UserIcon } from "../components/ui/icons"
import TailwindInput from "../components/forms/TailwindInput"

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
  const {updateUser, invalidateUser}=useCyfrUserApi()
  const [showZone, setShowZone] = useState<"all" | "results" | "none" | "zone" | null>('all')
  const [activeTab, setActiveTab] = useState('Preferences')
  const [cyfrName, setCyfrName] = useState<string|null>(null)

  const onNameChange = () => {
    if (cyfrName===null||cyfrName.length<3) {
      return
    }
    const newCyfrUser = {
      ...cyfrUser,
      name: cyfrName
    } as unknown as UserWithPostsLikes
    updateUser({newUser:newCyfrUser})
      .then(r => {
        log(`\tonNameChange complete`)
        invalidateUser()
      })
      .catch(e => {
        log(`\tonNameChange error ${JSON.stringify(e,null,2)}`)
      })
  }

  const onFileComplete = async (file:CompleteFile) => {
    if (file.secure_url) {
      // setShowZone(null)
      const newCyfrUser = {
        ...cyfrUser,
        image: file.secure_url
      } as unknown as UserWithPostsLikes
      updateUser({newUser:newCyfrUser})
        .then(r => {
          // setShowZone('none')
          invalidateUser()
        })
        .catch(e => {
          setShowZone('all')
          log(`\tonFileComplete error ${JSON.stringify(e,null,2)}`)
        })
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
            <Dropzone types='img' onFileCompleted={onFileComplete} limit={1} show={showZone}>
              <Avatar user={cyfrUser} sz="md" />
            </Dropzone>
          </div>
        }
        
        {activeTab==="Billing" &&
          <h2 className="subtitle">Billing</h2>
        }
              
        {activeTab==="User" &&
          <div className="mt-12">
            <UserAccountDetail user={cyfrUser} />
          </div>
        }

      </>}
    </MainLayout>
  )
}

export default Account
