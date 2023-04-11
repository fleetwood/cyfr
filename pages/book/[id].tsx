import { InferGetServerSidePropsType } from "next";
import BookDetailComponent from "../../components/containers/Books/BookDetailComponent";
import { useCyfrUserContext } from "../../components/context/CyfrUserProvider";
import MainLayout from "../../components/layouts/MainLayout";
import { BookDetail, PrismaBook } from "../../prisma/prismaContext";

export async function getServerSideProps(context: any) {
  const id = context.params["id"];
  const book = await PrismaBook.details(id)

  return { props: { book } }
}

const BookByID = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [cyfrUser] = useCyfrUserContext();
  const book:BookDetail = props.book as BookDetail
  const by = book.authors.flatMap((author) => author.name).join(" and ");
  //todo: This should be handled by a commune...
  const isAuthor = (book.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0
  return (
    <MainLayout
      pageTitle={`${book.title} by ${by}`}
      sectionTitle={book.title}
      subTitle={by}
    >
      <BookDetailComponent book={book} />
    </MainLayout>
  );
};

export default BookByID;
