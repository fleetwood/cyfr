import BookDetailLayout, { BookDetailLayoutProps } from "../../../../components/layouts/BookDetailLayout"
import useCyfrUser from "../../../../hooks/useCyfrUser"
import { PrismaBook, PrismaGenre } from "../../../../prisma/prismaContext"

export async function getServerSideProps(context: any) {
  const id = context.params.id
  const bookDetail = await PrismaBook.detail(id)
  const genres = await PrismaGenre.all()

  return {
    props: {
      bookDetail,
      genres
    } as BookDetailLayoutProps,
  }
}

const BookByID = (props: BookDetailLayoutProps) => BookDetailLayout(props)

export default BookByID

