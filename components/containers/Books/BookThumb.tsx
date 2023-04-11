import Link from "next/link";
import { BookStub } from "../../../prisma/prismaContext";
import { cloudinary } from "../../../utils/cloudinary";

type BookThumbProps = {
    book: BookStub
}

const BookThumb = ({book}:BookThumbProps) => {
  const cover = book.cover || null
  return (
    <Link href={`/book/${book.slug ?? book.id}`}>
    {cover !== null
        ? <img src={cloudinary.thumb({ url: cover.url, width: 100 })} />
        : <span>{book.title}</span>
    }
    </Link>
  );
};

export default BookThumb;
