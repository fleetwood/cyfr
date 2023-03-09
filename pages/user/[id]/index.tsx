import MainLayout from "../../../components/layouts/MainLayout"
import useCyfrUser from "../../../hooks/useCyfrUser"
import useUserDetail from "../../../hooks/useUserDetail"
import UserDetailComponent from "../../../components/containers/User/UserDetailComponent"

export async function getServerSideProps(context: any) {
  const userId = context.params.id
  return {
    props: {
      userId,
    },
  }
}

type UserDetailProps = {
  userId: string
  layout?: 'main'|'none'
}

const UserDetailPage = ({ userId, layout='main' }: UserDetailProps) => {
  const [cyfrUser] = useCyfrUser()
  const { currentUser, follow, stan, invalidateUser } = useUserDetail({id: userId})
  
  return (
    <>
    {
      layout === 'main' &&
      <MainLayout
        pageTitle="User Detail"
        sectionTitle=""
        subTitle={currentUser?.name || ""}
      >
        {currentUser && 
          <UserDetailComponent userId={currentUser!.id} />
        }
      </MainLayout>
    }
    { layout==='none' && currentUser && <UserDetailComponent userId={currentUser!.id} /> }
    </>
)}

export default UserDetailPage
