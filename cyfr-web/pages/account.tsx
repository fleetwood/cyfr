import { useEffect, useState } from "react"
import UserAccountDetail from "../components/containers/User/UserAccountDetail"
import MainLayout from "../components/layouts/MainLayout"
import useCyfrUser from "../hooks/useCyfrUser"
import { UserWithPostsLikes, Users } from "../prisma/users"
import { GetSessionParams, signOut } from "next-auth/react"
import { useSession } from "../lib/next-auth-react-query"
import { useRouter } from "next/router"

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const user = await Users.userInSession(context)
  
  return { props: { user } }
}

type AccountProps = {
  user?: UserWithPostsLikes | undefined
}

const Account = ({user}:AccountProps) => {
  const [session] = useSession({required: true, redirectTo: '/login'})
  const {cyfrUser, setCyfrUser, invalidateUser} = useCyfrUser()
  const [currentPane, setCurrentPane] = useState('Billing');

  useEffect(() => { invalidateUser() },[cyfrUser])

  return (
    <MainLayout sectionTitle="Account">
      {cyfrUser &&  <>
        <button onClick={() => signOut()} className="btn btn-primary">Logout</button>
        {/* @ts-ignore */}
        <h2 className="h-subtitle">{cyfrUser.name || ''}</h2>
        <div className="flex justify-between w-full pt-2 mt-4">
          <button className={`btn ${currentPane === 'Billing' ? 'btn-secondary rounded-b-none ' : 'btn-primary -mt-2'} w-[25%]`} onClick={() => setCurrentPane('Billing')} >Billing</button>
          <button className={`btn ${currentPane === 'User' ? 'btn-secondary rounded-b-none ' : 'btn-primary -mt-2'} w-[25%]`} onClick={() => setCurrentPane('User')}>User</button>
        </div>
        <div className="flex border-t-4 border-secondary rounded-b-lg p-2">
          {currentPane === 'Billing' &&
            <div className="w-full">
              <h2 className="subtitle">Billing</h2>
            </div>
          }
          {currentPane === 'User' && cyfrUser && 
            <div className="w-full mt-8">
              <UserAccountDetail currentUser={cyfrUser} />
            </div>
          }
        </div>
      </>}
    </MainLayout>
  )
}

export default Account
