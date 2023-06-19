import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { Dropzone } from "components/forms"
import { CheckBadge } from "components/ui/icons"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import { BookDetail, BookStub, Image } from "prisma/prismaContext"
import { cloudinary } from "utils/cloudinary"
import { isAuthor } from "utils/helpers"

const {debug} = useDebug('BookEditCover', 'DEBUG')

/**
 * @property book {@link BookDetail} | {@link BookStub}
 * @property variant {@link BookCoverVariant}
 */
type BookCoverProps = {
    book:       BookDetail
    onUpdate?:  () => void
}

const BookImage = ({cover, title, width, owner}:{cover: Image|null, title: string, width: number, owner?:boolean}) => { 
  const badge = owner ? <span className="absolute top-0 right-0 text-success" aria-label="Your Book!">{CheckBadge}</span> : ''
  
  return <div className="book-cover">
    {cover && 
      <div><img src={cloudinary.thumb({ url: cover.url, width })} />{badge}</div>
    }
  </div>
}

/**
 * 
 * @param props {@link BookCoverProps}  
 * @property book {@link BookDetail} | {@link BookStub}
 * @property variant {@link BookCoverVariant} 
 * @returns 
 */
const BookEditCover = ({book, onUpdate}:BookCoverProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const isOwner = isAuthor({book,cyfrUser})
  const cover = book.cover || null
  
  debug('BookCover', {cyfrUser: cyfrUser?.name ?? 'No cyfrUser', isOwner})

  return (
    <div className="">
      {cover &&
        <BookImage cover={book.cover!} title={book.title} width={book.cover!.width!} owner={isOwner} />
      }{!cover &&
        <div className="border-dashed border-neutral border-2 w-full h-12">
          No cover
        </div>
      }
      <div className="flex justify-evenly w-full">
        <div>
          <Dropzone limit={1} />
        </div>
        <div>Find a Cover</div>
      </div>
    {/* <JsonBlock data={book} /> */}
    </div>
)}

export default BookEditCover
