import {signOut} from "next-auth/react"
import { useEffect, useState } from "react"
import UserAccountDetail from "../components/containers/User/UserAccountDetail"
import MainLayout from "../components/layouts/MainLayout"
import useCyfrUser from "../hooks/useCyfrUser"
import { useSession } from "../lib/next-auth-react-query"
import { jsonify } from "../utils/log"

const Account = () => {
  const [session] = useSession({ required: true, redirectTo: '/login', queryConfig: { refetchInterval: 60000 }})
  const {cyfrUser, setCyfrUser, invalidate} = useCyfrUser()
  const [currentPane, setCurrentPane] = useState('Billing');

  useEffect(() => {
    invalidate()
  },[session])

  return (
    <MainLayout sectionTitle="Account">
      {session && <button onClick={() => signOut()} className="btn btn-primary">Logout</button>}
      {cyfrUser &&  <>
        {/* @ts-ignore */}
        <h2 className="h-subtitle">{cyfrUser.name || ''}</h2>
        <div className="flex justify-between w-full pt-2 mt-4">
          <button className={`btn ${currentPane === 'Billing' ? 'btn-secondary rounded-b-none ' : 'btn-primary -mt-2'} w-[25%]`} onClick={() => setCurrentPane('Billing')} >Billing</button>
          <button className={`btn ${currentPane === 'Session' ? 'btn-secondary rounded-b-none ' : 'btn-primary -mt-2'} w-[25%]`} onClick={() => setCurrentPane('Session')}>Session</button>
          <button className={`btn ${currentPane === 'User' ? 'btn-secondary rounded-b-none ' : 'btn-primary -mt-2'} w-[25%]`} onClick={() => setCurrentPane('User')}>User</button>
        </div>
        <div className="flex border-t-4 border-secondary rounded-b-lg p-2">
          {currentPane === 'Billing' &&
            <div>
              <h2 className="subtitle">Billing</h2>
            </div>
          }
          {currentPane === 'Session' && session && 
            <div>
              <h2 className="subtitle">Session</h2>
              <pre>{jsonify(session)}</pre>
            </div>
          }
          {currentPane === 'User' && cyfrUser && 
            <div>
              <h2 className="subtitle">CyfrUser</h2>
              <UserAccountDetail currentUser={cyfrUser} />
            </div>
          }
        </div>
      </>}
    </MainLayout>
  )
}

export default Account
