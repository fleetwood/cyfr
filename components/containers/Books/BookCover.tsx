import {Avatar} from "@mui/material"
import {useCyfrUserContext} from "components/context/CyfrUserProvider"
import AuthorAvatar from "components/ui/avatar/authorAvatar"
import {CheckBadge} from "components/ui/icons"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import {BookDetail,BookStub, Cover, CoverStub} from "prisma/prismaContext"
import useApi from "prisma/useApi"
import {cloudinary} from "utils/cloudinary"
import {domRef,isAuthor} from "utils/helpers"

const {debug} = useDebug('containers/Books/BookCover')

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

const BookImage = ({cover, title, width, owner}:{cover?: Cover | CoverStub, title: string, width: number, owner?:boolean}) => { 
  const badge = owner ? <span className="absolute top-0 right-0 text-success" aria-label="Your Book!">{CheckBadge}</span> : ''
  
  return <div className="book-cover">
    {/* @ts-ignore */}
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
const BookCover = ({book, variant = BookCoverVariant.THUMB, link = true, authorAvatars=true}:BookCoverProps) => {
  const {cyfrUser} = useApi.cyfrUser()
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
    {authorAvatars && 
      <div className="flex pt-2 space-x-2">
        {book.authors?.map(author => (
          <AuthorAvatar author={author} sz="sm" link={false} className="absolute bottom-0 float-right" key={domRef(book,author)} />
        ))}
      </div>
    }
    {/* <JsonBlock data={book} /> */}
    </div>
)}

export default BookCover
