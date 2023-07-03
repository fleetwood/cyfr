import UserDetailView from "../../../components/containers/User/UserDetailView";
import MainLayout from "../../../components/layouts/MainLayout";
import useUserDetail from "../../../hooks/useUserDetailQuery";
import { InferGetServerSidePropsType } from "next";

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

// @ts-ignore
const UserDetailPage = ({ userId, layout='main' }:UserDetailProps) => {
  const { currentUser } = useUserDetail({id: userId})
  
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
          <UserDetailView userId={currentUser!.id} />
        }
      </MainLayout>
    }
    { layout==='none' && currentUser && <UserDetailView userId={currentUser!.id} /> }
    </>
)}

export default UserDetailPage
