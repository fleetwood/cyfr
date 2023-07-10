import Avatar from "components/ui/avatar"
import HtmlContent from "components/ui/htmlContent"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import { BookStub } from "prisma/prismaContext"
import { SizeProps } from "types/props"
import { uniqueKey } from "utils/helpers"
import BookCover, { BookCoverVariant } from "./BookCover"
import BookFooter from "./BookFooter"

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
      
      <div className="bg-primary text-primary-content p-4">
        <h3><Link href={`/book/${book.slug}`}>{book.title}</Link></h3>
        {showAuthors && book.authors && book.authors.length > 0 && 
          <div className="flex my-4">
            <span className="pr-2">by</span>
            {book.authors.map((author) => 
              <Avatar user={author.user} sz={size} key={uniqueKey(book, author)} />
            )}
          </div>
        }
      </div>
        
      <div className="p-4">
        <BookCover book={book} 
          variant={ size === 'sm' || size === 'xs' ? BookCoverVariant.THUMB : BookCoverVariant.COVER} 
          authorAvatars={authorAvatars} />
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
