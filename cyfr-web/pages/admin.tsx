import { GetSessionParams } from "next-auth/react"
import { Router } from "next/router"
import AdminLayout from "../components/layouts/AdminLayout"
import { CyfrLogo } from "../components/ui/icons"
import useFeed from "../hooks/useFeed"
import { useSession } from "../lib/next-auth-react-query"
import { PrismaUser } from "../prisma/prismaContext"
import { canAccess } from "../prisma/types"
import { InferGetServerSidePropsType } from "next";

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
        <h2 className="h-subtitle">Allow {allow}</h2>
      </div>
    </AdminLayout>
  )
}

export default AdminPage
