import { InferGetServerSidePropsType } from "next";
import BookStubView from "../../../components/containers/Books/BookStubView";
import MainLayout from "../../../components/layouts/MainLayout";
import { Book, BookStub, PrismaUser, UserDetail } from "../../../prisma/prismaContext";
import { useCyfrUserContext } from "../../../components/context/CyfrUserProvider";
import UpsertBook from "../../../components/containers/Books/UpsertBook";
import { useEffect, useState } from "react";
import JsonBlock from "../../../components/ui/jsonBlock";
import useBookQuery from "hooks/useBookQuery";
import useDebug from "hooks/useDebug";

const {debug, jsonBlock} = useDebug('pages/user/[id]/books', 'DEBUG')

export async function getServerSideProps(context: any) {
  const user = await PrismaUser.detail({slug: context.query.id})
  const books = await PrismaUser.books({slug: context.query.id})

  debug('getServerSideProps', {slug: context.query.id, user: user.name, books: (books??[]).length})

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
  const [cyfrUser] = useCyfrUserContext()
  const title = `Books by ${user ? user.name : 'Somebody'}`
  const isOwner = user && cyfrUser ? user.id === cyfrUser.id : false

  return user ? (
    <MainLayout pageTitle={title} sectionTitle={title}>
      <div className="flex flex-col space-y-4">
        {books && books.map((book:BookStub) => <BookStubView book={book} key={book.id} authorAvatars={false} />)}
      </div>
      {isOwner && <UpsertBook />}
    </MainLayout>
  ) : (
    <MainLayout sectionTitle="Books">
      <div className="bg-error text-error-content">Failed to find that user....</div>
    </MainLayout>
  )
  
}

export default UserBooksPage