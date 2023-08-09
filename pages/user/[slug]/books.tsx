import BookStubView from "components/containers/Books/BookStubView";
import CreateBook from "components/containers/Books/CreateBook";
import UpsertBook from "components/containers/Books/UpsertBook";
import { useCyfrUserContext } from "components/context/CyfrUserProvider";
import MainLayout from "components/layouts/MainLayout";
import useDebug from "hooks/useDebug";
import { BookStub, PrismaUser, UserDetail } from "prisma/prismaContext";
import useApi from "prisma/useApi";

const {debug, jsonBlock} = useDebug('pages/user/[id]/books', )

export async function getServerSideProps(context: any) {
  const {slug} = context.query
  const user = await PrismaUser.detail({slug})
  const books = await PrismaUser.books({slug})

  debug('getServerSideProps', {slug, user: user.name, books: (books??[]).length})

  return {
    props: {
      user,
      books
    },
  };
}

type UserBooksPageProps = {
  user: UserDetail
  books: any[]
}

const UserBooksPage = ({ user, books }:UserBooksPageProps) => {  
  const {cyfrUser} = useApi.cyfrUser()
  const title = `Books by ${user ? user.name : 'Somebody'}`
  const isOwner = user && cyfrUser ? user.id === cyfrUser?.id : false

  return user ? (
    <MainLayout pageTitle={title} sectionTitle={title}>
      <div className="flex flex-col space-y-4">
        {books && books.map((book:BookStub) => <BookStubView book={book} key={book.id} authorAvatars={false} />)}
      </div>
      {isOwner && <><CreateBook /></>}
    </MainLayout>
  ) : (
    <MainLayout sectionTitle="Books">
      <div className="bg-error text-error-content">Failed to find that user....</div>
    </MainLayout>
  )
  
}

export default UserBooksPage