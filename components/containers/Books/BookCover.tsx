import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { CheckBadge } from "components/ui/icons"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import { BookDetail, BookStub, CoverStub, Image } from "prisma/prismaContext"
import { cloudinary } from "utils/cloudinary"
import { isAuthor } from "utils/helpers"

const {debug} = useDebug('BookCover')

export enum BookCoverVariant {
  THUMB = 100,
  COVER = 250,
  FULL = 1000
}

/**
 * @property book {@link BookDetail} | {@link BookStub}
 * @property variant {@link BookCoverVariant}
 */
type BookCoverProps = {
    book: BookDetail|BookStub
    variant?: BookCoverVariant
    link?: Boolean
    authorAvatars?: Boolean
}

const BookImage = ({cover, title, width, owner}:{cover?: CoverStub, title: string, width: number, owner?:boolean}) => { 
  const badge = owner ? <span className="absolute top-0 right-0 text-success" aria-label="Your Book!">{CheckBadge}</span> : ''
  
  return <div className="book-cover">
    <div><img src={cloudinary.thumb({ url: cover?.image?.url ?? cloudinary.defaultCover, width })} />{badge}</div>
  </div>
}

/**
 * 
 * @param props {@link BookCoverProps}  
 * @property book {@link BookDetail} | {@link BookStub}
 * @property variant {@link BookCoverVariant} 
 * @returns 
 */
const BookCover = ({book, variant = BookCoverVariant.THUMB, link = true}:BookCoverProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const isOwner = isAuthor({book,cyfrUser})
  const cover = book.cover || null
  const width = (variant === BookCoverVariant.FULL && cover !== null)
    ? cover.image.width
    : Number(variant) as number
  debug('BookCover', {cyfrUser: cyfrUser?.name ?? 'No cyfrUser', isOwner})

  const Booky = () => <BookImage cover={book.cover} title={book.title} width={width!} owner={isOwner} />

  return (
    <div className="max-w-fit relative p-4">
    {link 
      ? <Link href={`/book/${book.slug ?? book.id}`}><Booky /></Link> 
      : <Booky />
    }
    </div>)
}

export default BookCover
