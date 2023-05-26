import { useRouter } from "next/router"
import useDebug from "../../../hooks/useDebug"
import { BookStub } from "../../../prisma/prismaContext"
import { uniqueKey } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Avatar from "../../ui/avatar"
import HtmlContent from "../../ui/htmlContent"
import BookCover, { BookCoverVariant } from "./BookCover"
import Link from "next/link"
import BookApi from "../../../prisma/api/bookApi"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent')

type BookComponentProps = {
  book:           BookStub
  authorAvatars?: Boolean
  variant?:       'feed' | 'stub' | 'detail'
}

const BookStubView = ({book, authorAvatars, variant='stub'}: BookComponentProps) => {
  const isStub = variant === "stub"
  const isFeed = variant === 'feed'
  const isDetail = variant === 'detail'

  return (
    <div>
      
      {!isFeed || book.cover === null &&
        <h3><Link href={`/book/${book.slug}`}>{book.title}</Link></h3>
      }

      {!isFeed && book.authors && book.authors.length > 1 && 
        <div className="flex my-4">
          <span>by </span>
          {book.authors.map((author) => 
            <Avatar user={author} sz="lg" key={uniqueKey(book, author)} />
          )}
        </div>
      }

      {book.cover &&
        <BookCover book={book} variant={ isFeed ? BookCoverVariant.THUMB : BookCoverVariant.COVER} authorAvatars={authorAvatars} />
      }
      
      <div>
        <div className="flex">
          <span>{book.fiction ? 'FICTION' : 'NON-FICTION'}</span>
          {book.genre && <span>{book.genre?.title}</span>}
          {book.categories?.filter(m => m !== null).map(cat => (<span className="" key={cat.id}>{cat.title}</span>))}
        </div>
        <div>{book.words} words</div>
        {book.hook &&
          <div className="my-4 text-xl font-ibarra"><HtmlContent content={book.hook} /></div>
        }
      </div>

    </div>
  )
}

export default BookStubView
