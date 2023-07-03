import useRocketQuery from "hooks/useRocketQuery";
import UserDetailView from "../../../components/containers/User/UserDetailView";
import MainLayout from "../../../components/layouts/MainLayout";
import useUserDetail from "../../../hooks/useUserDetailQuery";
import { InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: any) {
  const slug = context.params.id
  return {
    props: {
      slug,
    },
  }
}

type UserDetailProps = {
  userId: string
  layout?: 'main'|'none'
}

// @ts-ignore
const UserDetailPage = ({ slug, layout='main' }:UserDetailProps) => {
  const {data: currentUser, isLoading, error} = useRocketQuery({
    name: `user-${slug}`,
    url: `user/${slug}`,
    body: {slug}
  })
  
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
