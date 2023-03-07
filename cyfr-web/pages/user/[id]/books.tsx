import MainLayout from "../../../components/layouts/MainLayout"
import { Book, BookDetail, PrismaBook, PrismaUser, UserDetail } from "../../../prisma/prismaContext";
import { InferGetServerSidePropsType } from "next";
import { uniqueKey } from "../../../utils/helpers";
import { cloudinary } from "../../../utils/cloudinary";

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
  const title = `Books by ${user ? user.name : 'Nobody'}`
  return user ? (
    <MainLayout pageTitle={title} sectionTitle={title}>
      <div className="flex flex-col">
        {books && books.map(book => (
          <div key={uniqueKey(user, book)}>
            <h2>{book.title}</h2>
            <img src={cloudinary.thumb({url: book.cover, width:90})} alt={`Book cover for title ${book.title}`} />
          </div>
        ))}
      </div>
    </MainLayout>
  ) : (
    <MainLayout sectionTitle="Books">
      <div className="bg-error text-error-content">Failed to find that user....</div>
    </MainLayout>
  )
}

export default UserBooksPage