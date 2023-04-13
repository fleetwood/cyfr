import React from "react"
import { BookDetail, BookStub } from "../../../prisma/prismaContext"
import Avatar from "../../ui/avatar"
import { uniqueKey } from "../../../utils/helpers"
import useDebug from "../../../hooks/useDebug"
import BookCover, { BookCoverVariant } from "./BookCover"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent', 'DEBUG')

type BookComponentProps = {
  book: BookDetail
}

const BookDetailComponent = ({book}: BookComponentProps) => {
  return (
    <div>
      {book.authors?.map((author) => 
        <Avatar user={author} sz="lg" key={uniqueKey(book, author)} />
      )}
      {book.cover &&
        <BookCover book={book} variant={BookCoverVariant.COVER} link={false} />
      }
      {jsonBlock(book)}
    </div>
  )
}

export default BookDetailComponent
