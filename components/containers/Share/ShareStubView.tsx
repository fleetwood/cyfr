import { BookStub, CharacterStub, GalleryStub, ImageStub, ShareStub } from 'prisma/prismaContext'

import useDebug from 'hooks/useDebug'
import BookStubView from '../Books/BookStubView'
import CharacterStubView from '../Characters/CharacterStubView'
import GalleryStubView from '../Gallery/GalleryStubView'
import ImageStubView from '../Image/ImageStubView'
import PostStubView from '../Post/PostStubView'

const { debug, jsonBlock } = useDebug('SharedPostStubView','DEBUG')

type SharedPostFeedItemProps = {
  share: ShareStub
}

const SharedStubView = ({ share }: SharedPostFeedItemProps) => {
  const comments: any[] = []
  const {book, character, cover, event, gallery, image, post} = share

  return (
    <div className='bg-neutral bg-opacity-10 rounded-lg p-4'>
      {post && <PostStubView post={post} />}

      {image && <ImageStubView image={image as ImageStub} />}

      {gallery && <GalleryStubView gallery={gallery as GalleryStub} />}

      {book && <BookStubView book={book as unknown as BookStub} size="sm" showFooter={false} />}

      {character && <CharacterStubView characterStub={character as unknown as CharacterStub} />}
    </div>
)}

export default SharedStubView
