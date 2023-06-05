import Link from "next/link";
import useDebug from "../../../hooks/useDebug";
import useBookApi from "../../../prisma/hooks/useBookApi";
import { BookDetail, BookStub, Image } from "../../../prisma/prismaContext";
import { cloudinary } from "../../../utils/cloudinary";
import { uniqueKey } from "../../../utils/helpers";
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
  
  return (
    <div className="book-cover">
      <div><h3>{title}</h3>{badge}</div>
      {cover && 
        <div><img src={cloudinary.thumb({ url: cover.url, width })} />{badge}</div>
      }
    </div>
)}

/**
 * 
 * @param props {@link BookCoverProps}  
 * @property book {@link BookDetail} | {@link BookStub}
 * @property variant {@link BookCoverVariant} 
 * @returns 
 */
const BookCover = ({book, variant = BookCoverVariant.THUMB, link = true, authorAvatars=true}:BookCoverProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const {isAuthor} = useBookApi()
  const isOwner = isAuthor({book,cyfrUser})
  const cover = book.cover || null
  const width = (variant === BookCoverVariant.FULL && cover !== null)
    ? cover.width
    : Number(variant) as number
  debug('BookCover', {cyfrUser: cyfrUser?.name ?? 'No cyfrUser', isOwner})

  const Booky = () => <BookImage cover={book.cover||null} title={book.title} width={width!} owner={isOwner} />

  return (
    <div className="max-w-fit relative p-4">
    {link 
      ? <Link href={`/book/${book.slug ?? book.id}`}><Booky /></Link> 
      : <Booky />
    }
    {authorAvatars && 
      <div className="flex pt-2 space-x-2">
        {book.authors?.map(author => (
          <Avatar user={author} sz="sm" link={false} className="absolute bottom-0 float-right" key={uniqueKey(book,author)} />
        ))}
      </div>
    }
    {/* <JsonBlock data={book} /> */}
    </div>
)}

export default BookCover
