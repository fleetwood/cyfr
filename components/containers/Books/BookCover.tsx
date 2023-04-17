import Link from "next/link";
import useDebug from "../../../hooks/useDebug";
import { BookDetail, BookStub, Image } from "../../../prisma/prismaContext";
import { cloudinary } from "../../../utils/cloudinary";
import { isBookAuthor } from "../../../utils/helpers";
import { useCyfrUserContext } from "../../context/CyfrUserProvider";
import Avatar from "../../ui/avatar";
import { CheckBadge } from "../../ui/icons";

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

const BookImage = ({cover, title, width, owner}:{cover: Image|null, title: string, width: number, owner?:boolean}) => { 
  const badge = owner ? <span className="absolute top-0 right-0 text-success" aria-label="Your Book!">{CheckBadge}</span> : ''
  
  return cover !== null
      ? <><img src={cloudinary.thumb({ url: cover.url, width })} />{badge}</>
      : <>{title}{badge}</>
}

/**
 * 
 * @param props {@link BookCoverProps}  
 * @property book {@link BookDetail} | {@link BookStub}
 * @property variant {@link BookCoverVariant} 
 * @returns 
 */
const BookCover = ({book, variant = BookCoverVariant.THUMB, link = true, authorAvatars=true}:BookCoverProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const isOwner = isBookAuthor(book,cyfrUser)
  const cover = book.cover || null
  const width = (variant === BookCoverVariant.FULL && cover !== null)
    ? cover.width
    : Number(variant) as number
  debug('BookCover', {cyfrUser: cyfrUser?.name ?? 'No cyfrUser', isOwner})
  return (
    <div className="max-w-fit relative">
    {link 
      ? <Link href={`/book/${book.slug ?? book.id}`}><BookImage cover={book.cover||null} title={book.title} width={width!} owner={isOwner} /></Link> 
      : <BookImage cover={book.cover||null} title={book.title} width={width!} owner={isOwner} />
    }
    {authorAvatars && book.authors?.map(author => (
      <Avatar user={author} sz="sm" link={false} className="absolute bottom-0 float-right" />
    ))}
    {/* <JsonBlock data={book} /> */}
    </div>
)}

export default BookCover
