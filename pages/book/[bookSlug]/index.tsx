import BookDetailLayout, { BookDetailLayoutProps } from "../../../components/layouts/BookDetailLayout";
import useDebug from "../../../hooks/useDebug";
import { PrismaGenre } from "../../../prisma/prismaContext";

const {debug, info} = useDebug('pages/book/[bookId]')

export async function getServerSideProps(context: any) {
  const {bookSlug} = context.params
  const genres = await PrismaGenre.stubs()

  return {
    props:{
      bookSlug,
      genres
    }
  }
}

const BookDetailPage = (props:BookDetailLayoutProps) => BookDetailLayout(props)

export default BookDetailPage;
