import MainLayout from "../../../components/layouts/MainLayout"
import { Book, BookDetail, PrismaBook, PrismaUser, UserDetail } from "../../../prisma/prismaContext";
import { InferGetServerSidePropsType } from "next";
import { uniqueKey } from "../../../utils/helpers";
import { cloudinary } from "../../../utils/cloudinary";
import useCyfrUser from "../../../hooks/useCyfrUser";
import UpsertBook from "../../../components/containers/Books/UpsertBook";
import { useEffect, useState } from "react";

export async function getServerSideProps(context: any) {
  const authorId = context.params.id;
  const user = await PrismaUser.byNameOrId(authorId);
  const books = user ? await PrismaBook.byUser(user.id) : []

  return {
    props: {
      books,
      user,
    },
  };
}

const UserBooksPage = ({ user, books }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [cyfrUser] = useCyfrUser()
  const title = `Books by ${user ? user.name : 'Nobody'}`
  const [canEdit, setCanEdit] = useState<boolean>(false)

  useEffect(() => {
    setCanEdit(() => cyfrUser !== undefined && user !== undefined && cyfrUser.id === user.id)
  }, [cyfrUser, user])


  return user ? (
    <MainLayout pageTitle={title} sectionTitle={title}>
      <div className="flex flex-col space-y-4">
        {canEdit && (
          <UpsertBook />
        )}
        {books && books.map(book => <UpsertBook book={book} key={uniqueKey(user,book)} />)}
      </div>
    </MainLayout>
  ) : (
    <MainLayout sectionTitle="Books">
      <div className="bg-error text-error-content">Failed to find that user....</div>
    </MainLayout>
  )
}

export default UserBooksPage