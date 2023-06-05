import { InferGetServerSidePropsType } from "next";
import BookStubView from "../../../components/containers/Books/BookStubView";
import MainLayout from "../../../components/layouts/MainLayout";
import { Book, PrismaUser, UserDetail } from "../../../prisma/prismaContext";
import { useCyfrUserContext } from "../../../components/context/CyfrUserProvider";
import UpsertBook from "../../../components/containers/Books/UpsertBook";
import { useCyfrUserApi } from "../../../hooks/useCyfrUser";
import { useState } from "react";
import JsonBlock from "../../../components/ui/jsonBlock";

export async function getServerSideProps(context: any) {
  const user = await PrismaUser.detail(context.query.id)

  return {
    props: {
      user,
    },
  };
}

type UserBooksPageProps = {
  user: UserDetail
}

const UserBooksPage = ({ user }:UserBooksPageProps) => {  
  const [cyfrUser] = useCyfrUserContext()
  const {invalidateUser} = useCyfrUserApi()
  const [books, setBooks] = useState<Book[]>([])
  const title = `Books by ${user ? user.name : 'Somebody'}`
  const isOwner = user && cyfrUser ? user.id === cyfrUser.id : false

  return user ? (
    <MainLayout pageTitle={title} sectionTitle={title}>
      <div className="flex flex-col space-y-4">
        {/* {books && books.map((book:Book) => <BookStubView book={book} key={book.id} authorAvatars={false} />)} */}
        {books && books.map((book:Book) => <JsonBlock data={book} key={book.id} />)}
      </div>
      {isOwner && <UpsertBook onUpsert={() => invalidateUser()} />}
    </MainLayout>
  ) : (
    <MainLayout sectionTitle="Books">
      <div className="bg-error text-error-content">Failed to find that user....</div>
    </MainLayout>
  )
  
}

export default UserBooksPage