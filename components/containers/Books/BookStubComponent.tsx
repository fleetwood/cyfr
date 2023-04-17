import useDebug from "../../../hooks/useDebug"
import { BookStub } from "../../../prisma/prismaContext"
import { isBookAuthor, onlyFans, uniqueKey, valToLabel } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Avatar from "../../ui/avatar"
import { BookIcon, DollarIcon, HeartIcon, ReplyIcon, ShareIcon, StarIcon, UserIcon } from "../../ui/icons"
import BookCover, { BookCoverVariant } from "./BookCover"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent', 'DEBUG')

type BookComponentProps = {
  book: BookStub
  authorAvatars?: Boolean
}

const BookStubComponent = ({book, authorAvatars}: BookComponentProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const isOwner = isBookAuthor(book, cyfrUser)
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
          <span>{book.genre.title}</span>
          {book.categories.filter(m => m !== null).map(cat => (<span className="">{cat.title}</span>))}
        </div>
        <div>{book.words} words</div>
        <div className="my-4 text-xl font-ibarra">{book.hook}</div>
      </div>

        <div className="flex">
          <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold mr-2">{HeartIcon}</label>
            <span className="text-primary">{valToLabel(book.likes as number)}</span>
          </div>
          <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold mr-2">{ShareIcon}</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold mr-2">{UserIcon}</label>
            <span className="text-primary">{valToLabel(book.follows as number)}</span>
          </div>
          <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold mr-2">{ReplyIcon}</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold mr-2">{BookIcon}</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold mr-2">{StarIcon}</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold mr-2">{DollarIcon}</label>
            <span className="text-primary">(NI)</span>
          </div>
        </div>
      </div>
  )
}

export default BookStubComponent
