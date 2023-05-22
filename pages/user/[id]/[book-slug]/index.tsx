import BookDetailLayout, { BookDetailLayoutProps } from "../../../../components/layouts/BookDetailLayout"
import { PrismaBook, PrismaGenre } from "../../../../prisma/prismaContext"

export async function getServerSideProps(context: any) {
  const {bookId, bookSlug} = context.params
  const genres = await PrismaGenre.stubs()

  return {
    props:{
      bookId: bookId||bookSlug,
      genres
    }
  }
}

const BookByID = (props: BookDetailLayoutProps) => BookDetailLayout(props)

export default BookByID