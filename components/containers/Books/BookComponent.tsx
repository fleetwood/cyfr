import useDebug from "../../../hooks/useDebug"
import { BookStub } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent', 'DEBUG')

type BookComponentProps = {
  book: BookStub
}

const BookComponent = ({book}: BookComponentProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const isOwner = cyfrUser ? book.authors.filter(a => a.id === cyfrUser.id).length > 0 : false
  return (
    <div>
      <div>{book.id}</div>
      <div>Cover {book.coverId}</div>
      <div>Title {book.title}</div>
      <div>Words{book.words}</div>
      <div>Slug {book.slug}</div>
      <div>Back {book.back}</div>
      <div>Synopsis {book.synopsis}</div>
      <div>Hook {book.hook}</div>
      <div>Status {(book.status??'').toString()}</div>
      <div>Likes {book.likes.toString()}</div>
      <div>Follows {book.follows.toString()}</div>
      <div>Created {book.createdAt.toString()}</div>
      <div>Updated {book.updatedAt.toString()}</div>
      <div>Started {(book.startedAt??'').toString()}</div>
      <div>Completed {(book.completeAt??'').toString()}</div>
      <div>Fiction? {book.fiction.toString()}</div>
      <div>Gallery {book.galleryId}</div>
      <div>Genre {book.genreId}</div>
      <div>Prospecting? {book.prospect.toString()}</div>
      <div>Active {book.active}</div>
      {isOwner &&
        <>
          {jsonBlock(book)}
        </>
      }
    </div>
  )
}

export default BookComponent
