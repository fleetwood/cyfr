import { GetSessionParams } from "next-auth/react"
import { Router } from "next/router"
import AdminLayout from "../components/layouts/AdminLayout"
import { CyfrLogo } from "../components/ui/icons"
import useFeed from "../hooks/useFeed"
import { useSession } from "../lib/next-auth-react-query"
import { PrismaUser } from "../prisma/prismaContext"
import { canAccess } from "../prisma/types"
import { InferGetServerSidePropsType } from "next";
import TailwindInput from "../components/forms/TailwindInput"
import { useState } from "react"
import useDebug from "../hooks/useDebug"

const {debug} = useDebug({fileName: 'admin page', level: 'DEBUG'})

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const cyfrUser = await PrismaUser.userInSessionContext(context)
  const allow = canAccess({required: 'owner', cyfrUser: cyfrUser || undefined })
  return { props: { allow } }
}

type AdminPageProps = {
  allow: boolean
}

const AdminPage = ({allow}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useSession({required: true, redirectTo: '/'})
  const [currentGenre, setCurrentGenre] = useState<string|null>(null)

const addGenre = () => {
  if (currentGenre) {
    debug('addGenre', currentGenre)
  }
}


  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr Admin</div>
    </div>
  return (allow && 
    <AdminLayout sectionTitle={CyfrHome}>
      <div>
        <h2 className="h-title">Dashboard</h2>
      </div>
      <div>
        <h2 className="h-subtitle">Genres</h2>
        <TailwindInput type="text" label="Add new genre" placeholder="Genre" value={currentGenre} setValue={setCurrentGenre} />
        <button className="btn btn-primary rounded-lg text-primary-content px-4" onClick={addGenre} >Add</button>
      </div>
    </AdminLayout>
  )
}

export default AdminPage
