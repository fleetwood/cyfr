import BookDetailLayout, { BookDetailLayoutProps } from "../../../components/layouts/BookDetailLayout";
import useDebug from "../../../hooks/useDebug";
import { PrismaBook, PrismaGenre } from "../../../prisma/prismaContext";

const {debug, info} = useDebug('pages/book/[bookId]', 'DEBUG')

export async function getServerSideProps(context: any) {
  const {bookId} = context.params
  debug('getServerSideProps', bookId)
  const bookDetail = await PrismaBook.detail(bookId)
  const genres = await PrismaGenre.all()

  return {
    props: {
      bookDetail,
      genres
    } as BookDetailLayoutProps,
  }
}

const BookDetailPage = (props:BookDetailLayoutProps) => BookDetailLayout(props)

export default BookDetailPage;
