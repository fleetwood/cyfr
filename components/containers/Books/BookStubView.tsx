import { Router, useRouter } from "next/router"
import useDebug from "../../../hooks/useDebug"
import { BookStub } from "../../../prisma/prismaContext"
import { isBookAuthor, onlyFans, uniqueKey, valToLabel } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Avatar from "../../ui/avatar"
import EZButton from "../../ui/ezButton"
import { BookIcon, DollarIcon, HeartIcon, ReplyIcon, ShareIcon, StarIcon, UserIcon } from "../../ui/icons"
import BookCover, { BookCoverVariant } from "./BookCover"
import HtmlContent from "../../ui/htmlContent"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent')

type BookComponentProps = {
  book: BookStub
  authorAvatars?: Boolean
}

const BookStubView = ({book, authorAvatars}: BookComponentProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const isOwner = isBookAuthor(book, cyfrUser)
  const router = useRouter()

  return (
    <div>
      
      <h2>{book.title}</h2>

      {book.authors && book.authors.length > 1 && 
        <div className="flex my-4">
          <span>by </span>
          {book.authors.map((author) => 
            <Avatar user={author} sz="lg" key={uniqueKey(book, author)} />
          )}
        </div>
      }

      {book.cover &&
        <BookCover book={book} variant={BookCoverVariant.COVER} link={false} authorAvatars={authorAvatars} />
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
