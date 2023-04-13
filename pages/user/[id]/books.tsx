import { InferGetServerSidePropsType } from "next";
import BookStubComponent from "../../../components/containers/Books/BookStubComponent";
import MainLayout from "../../../components/layouts/MainLayout";
import { PrismaUser } from "../../../prisma/prismaContext";

export async function getServerSideProps(context: any) {
  const user = await PrismaUser.detail(context.query.id)

  return {
    props: {
      user,
    },
  };
}

const UserBooksPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {  
  const title = `Books by ${user ? user.name : 'Nobody'}`

  return user ? (
    <MainLayout pageTitle={title} sectionTitle={title}>
      <div className="flex flex-col space-y-4">
        {user.books && user.books.map(book => <BookStubComponent book={book} key={book.id} />)}
      </div>
    </MainLayout>
  ) : (
    <MainLayout sectionTitle="Books">
      <div className="bg-error text-error-content">Failed to find that user....</div>
    </MainLayout>
  )
  
}

export default UserBooksPage