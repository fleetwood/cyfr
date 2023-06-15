import Avatar from "components/ui/avatar"
import HtmlContent from "components/ui/htmlContent"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import { BookStub } from "prisma/prismaContext"
import { uniqueKey } from "utils/helpers"
import BookCover, { BookCoverVariant } from "./BookCover"
import BookFooter from "./BookFooter"

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
    <div className="border-2 border-primary rounded-lg">
      
      <div className="bg-primary text-primary-content p-4">
        <h3><Link href={`/book/${book.slug}`}>{book.title}</Link></h3>
        {isStub || isDetail && book.authors && book.authors.length > 1 && 
          <div className="flex my-4">
            <span>by </span>
            {book.authors.map((author) => 
              <Avatar user={author} sz={isDetail ? 'md' : 'sm'} key={uniqueKey(book, author)} />
            )}
          </div>
        }
      </div>
        
      <div className="p-4">
        {book.cover &&
          <BookCover book={book} variant={ isFeed ? BookCoverVariant.THUMB : BookCoverVariant.COVER} authorAvatars={authorAvatars} />
        }
        <div className="flex">
          <span>{book.fiction ? 'FICTION' : 'NON-FICTION'}</span>
          {book.genre && <span>{book.genre?.title}</span>}
          {book.categories?.filter(m => m !== null).map(cat => (<span className="" key={cat.id}>{cat.title}</span>))}
        </div>
        <div>{book.words} words</div>
        {book.hook &&
          <div className="my-4 text-xl font-ibarra"><HtmlContent content={book.hook} /></div>
        }
        {(isStub || isDetail) && <BookFooter bookStub={book} />}
      </div>
    </div>
  )
}

export default BookStubView
