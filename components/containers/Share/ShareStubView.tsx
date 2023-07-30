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

  return (
    <div className='bg-neutral bg-opacity-10 rounded-lg p-4'>
      {share.post && <PostStubView post={share.post} />}

      {share.image && <ImageStubView image={share.image as ImageStub} />}

      {share.gallery && <GalleryStubView gallery={share.gallery as GalleryStub} />}

      {share.book && <BookStubView book={share.book as unknown as BookStub} size="sm" showFooter={false} />}

      {share.character && <CharacterStubView characterStub={share.character as unknown as CharacterStub} />}
    </div>
)}

export default SharedStubView
