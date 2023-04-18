import { useRouter } from "next/router";
import BookDetailComponent from "../../components/containers/Books/BookDetailComponent";
import { useCyfrUserContext } from "../../components/context/CyfrUserProvider";
import MainLayout from "../../components/layouts/MainLayout";
import EZButton from "../../components/ui/ezButton";
import Spinner from "../../components/ui/spinner";
import useBookDetail from "../../hooks/useBookDetail";
import useDebug from "../../hooks/useDebug";
import { UserStub } from "../../prisma/prismaContext";

const {debug, info} = useDebug('pages/book/[id]', 'DEBUG')

const BookByID = ({}) => {
  const router = useRouter()
  const {id} = router.query

  const [cyfrUser] = useCyfrUserContext()
  // TODO: This is weird. Loading the book twice?
  const {book, isLoading, error, invalidate} = useBookDetail(((id||'').toString()))
  const by = (book?.authors||[]).flatMap((author:UserStub) => author.name).join(" and ");
  //todo: This should be handled by a commune...
  const isAuthor = (book?.authors||[]).filter((a:UserStub) => a.id === cyfrUser?.id).length > 0
  return (
    <MainLayout
      pageTitle={`${book?.title} by ${by}`} 
      sectionTitle={book?.title}
      subTitle={by}
    >
      {isLoading &&
        <Spinner />
      }
      {book &&
        <BookDetailComponent bookDetail={book} onUpdate={invalidate} />
      }
    </MainLayout>
  );
};

export default BookByID;
