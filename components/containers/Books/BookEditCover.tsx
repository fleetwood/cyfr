import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import { Dropzone } from "components/forms"
import { CheckBadge } from "components/ui/icons"
import useBookQuery from "hooks/useBookQuery"
import useDebug from "hooks/useDebug"
import Link from "next/link"
import { useBookApi } from "prisma/hooks/useBookApi"
import { BookDetail, BookStub, CoverStub, Image } from "prisma/prismaContext"
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

const BookImage = ({cover, title, width, owner}:{cover: CoverStub, title: string, width: number, owner?:boolean}) => { 
  const badge = owner ? <span className="absolute top-0 right-0 text-success" aria-label="Your Book!">{CheckBadge}</span> : ''
  
  return <div className="book-cover">
    {cover && 
      <div><img src={cloudinary.thumb({ url: cover.image.url, width })} />{badge}</div>
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
  const {changeCover} = useBookApi

  const isOwner = isAuthor({book,cyfrUser})
  const cover = book.cover || null
  
  debug('BookCover', {cyfrUser: cyfrUser?.name ?? 'No cyfrUser', isOwner})

  const onCoverImageAdded = async (files:Image[]) => {
    const image = files[0]
    if (image) {
      const result = await changeCover({book, image})
      if (result) {
        onUpdate ? onUpdate() : () => {}
      } else {
        debug('onCoverImageAdded', {message: 'Failed to changeCover', files})
      }
    }
  }

  return (
    <div className="">
      {cover && cover.image &&
        <BookImage cover={cover} title={book.title} width={cover.image.width!} owner={isOwner} />
      }{!cover &&
        <div className="border-dashed border-neutral border-2 w-full h-12">
          No cover
        </div>
      }
      <div className="flex justify-evenly w-full">
        <div>
          <Dropzone limit={1} onDropComplete={onCoverImageAdded} >
            {book.cover &&
            <img src={cloudinary.resize({url: book.cover.image.url, width: 200})} />}
          </Dropzone>
        </div>
        <div>Find a Cover</div>
      </div>
    {/* <JsonBlock data={book} /> */}
    </div>
)}

export default BookEditCover
