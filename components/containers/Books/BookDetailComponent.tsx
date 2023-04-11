import React from "react"
import { BookDetail } from "../../../prisma/prismaContext"
import Avatar from "../../ui/avatar"
import { uniqueKey } from "../../../utils/helpers"
import useDebug from "../../../hooks/useDebug"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent', 'DEBUG')

type BookComponentProps = {
  book: BookDetail
}

const BookDetailComponent = ({book}: BookComponentProps) => {
  return (
    <div>
      <div>Author{book.authors.length>1 && 's'}</div>
      {book.authors?.map((author) => 
        <Avatar user={author} sz="md" key={uniqueKey(book, author)} />
      )}
      {jsonBlock(book)}
    </div>
  )
}

export default BookDetailComponent
