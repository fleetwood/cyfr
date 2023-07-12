import UserDetailView from "components/containers/User/UserDetailView";
import MainLayout from "components/layouts/MainLayout";
import userApi from "prisma/hooks/userApi";
import { UserDetail } from "prisma/prismaContext";

export async function getServerSideProps(context: any) {
  const {slug} = context.params
  return {
    props: {
      slug,
    },
  }
}

// @ts-ignore
const UserDetailPage = ({layout='main', ...props}:UserDetailProps) => {
  const {query} = userApi()
  const {data, isLoading, error, invalidate} = query({slug: props.slug})
 
  const currentUser:UserDetail = data

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
          <UserDetailView slug={currentUser!.slug!} />
        }
      </MainLayout>
    }
    { layout==='none' && currentUser && <UserDetailView slug={currentUser!.slug!} /> }
    </>
)}

export default UserDetailPage
