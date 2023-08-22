import useDebug from "hooks/useDebug"
import {BookStub} from "prisma/prismaContext"

import BookCover,{BookCoverVariant} from "./BookCover"
import BookFooter from "./BookFooter"
import {SizeProps} from "types/props"
import AuthorAvatar from "components/ui/avatar/authorAvatar"
import {domRef} from "utils/helpers"
import HtmlContent from "components/ui/htmlContent"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent')

type BookComponentProps = {
  book:           BookStub
  authorAvatars?: Boolean
  size?:          SizeProps
  showAuthors?:   boolean
  showCovers?:    boolean
  showFooter?:    boolean
}

const BookStubView = ({book, authorAvatars, size = "md", showAuthors = true, showCovers = true, showFooter = true}: BookComponentProps) => {

  return (
    <div className="border-2 border-primary rounded-lg">
      
      <h2>{book.title}</h2>

      {book.authors && book.authors.length > 1 && 
        <div className="flex my-4">
          <span>by </span>
          {book.authors.map((author) => 
            <AuthorAvatar author={author} sz="lg" key={domRef(book, author)} />
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
          {/* TODO: categories */}
          {/* {book.categories?.filter(m => m !== null).map(cat => (<span className="" key={cat.id}>{cat.title}</span>))} */}
        </div>
        <div>{book.words} words</div>
        {book.hook &&
          <div className="my-4 text-xl font-ibarra"><HtmlContent content={book.hook} /></div>
        }
        {showFooter && <BookFooter bookStub={book} />}
      </div>
    </div>
  )
}

export default BookStubView
