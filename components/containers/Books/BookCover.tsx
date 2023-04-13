import Link from "next/link";
import { Image, BookStub, BookDetail } from "../../../prisma/prismaContext";
import { cloudinary } from "../../../utils/cloudinary";

export enum BookCoverVariant {
  THUMB = 100,
  COVER = 300,
  FULL = 1000
}

type BookCoverProps = {
    book: BookDetail|BookStub
    variant?: BookCoverVariant
    link?: Boolean
}

const BookImage = ({cover, title, width}:{cover: Image|null, title: string, width: number}) => { 
  return (
    cover !== null
      ? <img src={cloudinary.thumb({ url: cover.url, width })} />
      : <span>{title}</span>
)}

const BookCover = ({book, variant = BookCoverVariant.THUMB, link = true}:BookCoverProps) => {
  const cover = book.cover || null
  const width = (variant === BookCoverVariant.FULL && cover !== null)
    ? cover.width
    : Number(variant) as number
  
  return (link 
    ? <Link href={`/book/${book.slug ?? book.id}`}><BookImage cover={book.cover||null} title={book.title} width={width!} /></Link> 
    : <BookImage cover={book.cover||null} title={book.title} width={width!} />
)}

export default BookCover
