import MainLayout from "../../../components/layouts/MainLayout"
import { InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: any) {
  const userId = context.params.id
  return {
    props: {
      userId,
    },
  }
}

type UserBooksProps = {
  userId: string
}

const UserBooksPage = ({ userId }: UserBooksProps) => {
  return (
    <MainLayout pageTitle="Books for User" sectionTitle="Books for User">
      <div>Books for {userId}</div>
    </MainLayout>
  )
}

export default UserBooksPage