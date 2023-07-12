import BookDetailLayout, { BookDetailLayoutProps } from "components/layouts/BookDetailLayout"
import { PrismaGenre } from "prisma/prismaContext"

export async function getServerSideProps(context: any) {
  const {bookId, bookSlug} = context.params
  //TODO move this to an api
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