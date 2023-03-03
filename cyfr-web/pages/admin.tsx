import AdminLayout from "../components/layouts/AdminLayout"
import { CyfrLogo } from "../components/ui/icons"
import useFeed from "../hooks/useFeed"

type AdminPageProps = {}

const AdminPage = (props:AdminPageProps) => {
  const {feed} = useFeed({type: 'main'})

  const CyfrHome = 
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" /><div>Cyfr</div>
    </div>

  return (
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
