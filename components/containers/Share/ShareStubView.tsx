import { BookStub, CharacterStub, GalleryStub, ImageStub, PostStub, ShareStub } from 'prisma/prismaContext'

import useDebug from 'hooks/useDebug'
import BookStubView from '../Books/BookStubView'
import CharacterStubView from '../Characters/CharacterStubView'
import GalleryStubView from '../Gallery/GalleryStubView'
import ImageStubView from '../Image/ImageStubView'
import PostStubView from '../Post/PostStubView'

const { debug, jsonBlock } = useDebug('SharedPostStubView',)

type SharedPostFeedItemProps = {
  share: ShareStub
}

const SharedStubView = ({ share }: SharedPostFeedItemProps) => {
  const comments: any[] = []
  const {book, character, cover, gallery, image, post} = share

  return (
    <div className='rounded-lg m-4'>
      {post && <PostStubView post={post as PostStub} />}

      {image && <ImageStubView image={image as ImageStub} />}

      {cover && <ImageStubView image={cover.image as ImageStub} footer={false} />}

      {gallery && <GalleryStubView gallery={gallery as GalleryStub} />}

      {book && <BookStubView book={book as unknown as BookStub} size="sm" showFooter={false} />}

      {character && <CharacterStubView characterStub={character as unknown as CharacterStub} />}
    </div>
)}

export default SharedStubView
