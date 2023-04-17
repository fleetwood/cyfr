import BookDetailComponent from "../../../../components/containers/Books/BookDetailComponent"
import UpsertBook from "../../../../components/containers/Books/UpsertBook"
import { useCyfrUserContext } from "../../../../components/context/CyfrUserProvider"
import MainLayout from "../../../../components/layouts/MainLayout"
import { PrismaBook } from "../../../../prisma/entities"
import { BookDetail } from "../../../../prisma/types"
import { InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: any) {
    const bookSlug = context.params['book-slug']
    const book = await PrismaBook.detail(bookSlug)
    
  return { props: { book } }
}

const BookByID = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [cyfrUser] = useCyfrUserContext();
  const book:BookDetail = props.book as BookDetail
    const by = (book.authors??[]).flatMap(author => author.name).join(' and ')
    //todo: This should be handled by a commune...
    const isAuthor = (book.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0
  return (
    <MainLayout 
        pageTitle={`${book.title} by ${by}`} 
        sectionTitle={book.title} 
        subTitle={by}
        >
        {isAuthor 
            ? <UpsertBook book={book} />
            : <BookDetailComponent book={book} />
        }
    </MainLayout>
  )
}

export default BookByID

