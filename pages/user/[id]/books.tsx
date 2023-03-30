import { InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import UpsertBook from "../../../components/containers/Books/UpsertBook";
import { useCyfrUserContext } from "../../../components/context/CyfrUserProvider";
import MainLayout from "../../../components/layouts/MainLayout";
import { PrismaBook, PrismaUser } from "../../../prisma/prismaContext";
import { uniqueKey } from "../../../utils/helpers";

export async function getServerSideProps(context: any) {
  const user = await PrismaUser.userInSessionContext(context)
  const books = user ? await PrismaBook.byUser(user.id) : []

  return {
    props: {
      books,
      user,
    },
  };
}

const UserBooksPage = ({ user, books }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [cyfrUser] = useCyfrUserContext()
  const title = `Books by ${user ? user.name : 'Nobody'}`
  const [canEdit, setCanEdit] = useState<boolean>(false)

  useEffect(() => {
    setCanEdit(() => cyfrUser !== undefined && user !== undefined && user !== null && cyfrUser.id === user!.id)
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