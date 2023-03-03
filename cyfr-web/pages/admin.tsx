import { GetSessionParams } from "next-auth/react"
import { Router } from "next/router"
import AdminLayout from "../components/layouts/AdminLayout"
import { CyfrLogo } from "../components/ui/icons"
import useFeed from "../hooks/useFeed"
import { useSession } from "../lib/next-auth-react-query"
import { PrismaUser } from "../prisma/prismaContext"
import { CyfrUser } from "../prisma/types"
import { InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: GetSessionParams | undefined) {
  const user = await PrismaUser.userInSessionContext(context)
  return { props: { user: user?.email !== 'wizening@gmail.com' ? null: user } }
}

type AdminPageProps = {
  user?: CyfrUser | undefined
}

const AdminPage = ({user}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useSession({required: true, redirectTo: '/'})
  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr Admin</div>
    </div>
  return (user && 
    <AdminLayout sectionTitle={CyfrHome}>
      <div>
        Dashboard
      </div>
      <div>
        Stuff to do
      </div>
    </AdminLayout>
  )
}

export default AdminPage
