import useDebug from "../../../hooks/useDebug"
import { BookDetail } from "../../../prisma/prismaContext"
import { isBookAuthor, onlyFans, uniqueKey, valToLabel } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Avatar from "../../ui/avatar"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import BookCover, { BookCoverVariant } from "./BookCover"

const {jsonBlock, debug} = useDebug('components/Books/BookDetailComponent', 'DEBUG')

type BookComponentProps = {
  book: BookDetail
}

const BookDetailComponent = ({book}: BookComponentProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const isAuthor = isBookAuthor(book, cyfrUser)
  return (
    <div>
      {book.authors?.map((author) => 
        <Avatar user={author} sz="lg" key={uniqueKey(book, author)} />
      )}

      {book.cover &&
        <BookCover book={book} variant={BookCoverVariant.COVER} link={false} authorAvatars={false} />
      }
      
      <div>
        <div>{book.hook}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div>{book.words} words</div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <label className="font-semibold w-[50%]">Status</label>
          <span className="text-primary">{book.status}</span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <label className="font-semibold w-[50%]">Completed</label>
          <span className="text-primary">{book.completeAt ?? 'TBD'}</span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
          <label className="font-semibold w-[50%]">Prospecting</label>
          <span className="text-primary">{book.prospect ? 'YES' : 'NO'}</span>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Likes</label>
            <span className="text-primary">{valToLabel(book.likes?.length??0)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Shares</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Followers</label>
            <span className="text-primary">{valToLabel(book.follows?.length??0)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Fans</label>
            <span className="text-primary">{valToLabel(onlyFans(book.follows??[]).length)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Comments</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Reads</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Reviews</label>
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <label className="font-semibold w-[50%]">Purchases</label>
            <span className="text-primary">(NI)</span>
          </div>
        </div>
      

      <div>
        <h2>Back Panel</h2>
        <div>{book.back}</div>
      </div>
      <div>
        <h2>Synopsis</h2>
        <div>{book.synopsis}</div>
      </div>
      <div>
        <h2>Characters</h2>
      </div>
      <div>
        <h2>Gallery</h2>
        {book.gallery && <GalleryPhotoswipe gallery={book.gallery} />}
        {!book.gallery && <>No gallery</>}
      </div>
      {isAuthor && jsonBlock(book)}
    </div>
  )
}

export default BookDetailComponent
