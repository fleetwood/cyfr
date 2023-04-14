
import ReactHtmlParser from "react-html-parser"
import useDebug from "../../../hooks/useDebug"
import { BookDetail } from "../../../prisma/prismaContext"
import { isBookAuthor, onlyFans, uniqueKey, valToLabel } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import InlineTextarea from "../../forms/InlineTextarea"
import Avatar from "../../ui/avatar"
import { FeatherIcon, FireIcon, FollowIcon, HeartIcon, ReplyIcon, ShareIcon } from "../../ui/icons"
import ShrinkableIconButton from "../../ui/shrinkableIconButton"
import ShrinkableIconLabel from "../../ui/shrinkableIconLabel"
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
        <div>{book.fiction ? 'FICTION' : 'NON-FICTION'}</div>
        <div className="flex">
          <span className="font-semibold text-primary-content mr-4">{book.genre.title}</span>
          {/* TODO Categories view is broken in db */}
          {book.categories.filter(c => c!==null).map(cat => (<span className="italic mr-2">{cat.title}</span>))}
        </div>
        <div>{book.words} words</div>
        <div className="my-4 text-xl font-ibarra">{book.hook}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Status</label>
          <span className="text-secondary">{book.status}</span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Completed</label>
          <span className="text-secondary">{book.completeAt ?? 'TBD'}</span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Prospecting</label>
          <span className="text-secondary">{book.prospect ? 'YES' : 'NO'}</span>
        </div>
        <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-secondary rounded-lg">
          <label className="font-semibold w-[50%]">Public</label>
          <span className="text-secondary">{book.active ? 'YES' : 'NO'}</span>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Likes" icon={HeartIcon} onClick={() => {}} />
            <span className="text-primary">{valToLabel(book.likes?.length??0)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Shares" icon={ShareIcon} onClick={() => {}} />
            <span className="text-primary">(NI)</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Follows" icon={FollowIcon} onClick={() => {}} />
            <span className="text-primary">{valToLabel(book.follows?.length??0)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Fans" icon={FireIcon} onClick={() => {}} />
            <span className="text-primary">{valToLabel(onlyFans(book.follows??[]).length)}</span>
          </div>
          <div className="flex justify-between px-2 mb-2 mr-4 border border-opacity-50 border-primary rounded-lg">
            <ShrinkableIconLabel iconClassName="text-primary-content" labelClassName="text-primary-content font-semibold" label="Comments" icon={ReplyIcon} onClick={() => {}} />
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

      <div className="my-4">
        <div className="flex">
          <h3>Back Panel</h3>
          {isAuthor && FeatherIcon}
        </div>
        <div className="font-ibarra">{isAuthor 
          ? <InlineTextarea content={book.back} setContent={() => {}} />
          : ReactHtmlParser(book.back!)
        }</div>
      </div>

      <div className="my-4">
        <div className="flex">
          <h3>Synopsis</h3>
          {isAuthor && FeatherIcon}
        </div>
        <div className="font-ibarra">{isAuthor 
          ? <InlineTextarea content={book.synopsis} setContent={() => {}} />
          : ReactHtmlParser(book.synopsis!)
        }</div>
      </div>
      
      <div className="my-4">
        <div className="flex">
          <h3>Characters</h3>
          {isAuthor && FeatherIcon}
        </div>
      </div>

      {(book.gallery || isAuthor) && 
      <div className="my-4">
        <div className="flex">
          <h3>Gallery</h3>
          {isAuthor && FeatherIcon}
        </div>
        <GalleryPhotoswipe gallery={book.gallery} />
      </div>
      }

      {isAuthor && jsonBlock(book)}
      
    </div>
  )
}

export default BookDetailComponent
