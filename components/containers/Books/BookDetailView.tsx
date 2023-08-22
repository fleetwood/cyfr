import BookDetailHeader from "components/containers/Books/BookDetailHeader"
import ChapterList from "components/containers/Chapter/ChapterList"
import CreateCharacterModal, { OpenCharacterModalPlus } from "components/containers/Characters/CharacterCreateModal"
import GalleryCreateModal, { OpenGalleryModalPlus } from "components/containers/Gallery/GalleryCreateModal"
import GalleryPhotoswipe from "components/containers/Gallery/GalleryImages"
import { useToast } from "components/context/ToastContextProvider"
import { InlineTextarea } from "components/forms"
import HtmlContent from "components/ui/htmlContent"
import { PhotoIcon } from "components/ui/icons"
import useDebug from "hooks/useDebug"
import router from "next/router"
import ErrorPage from "pages/404"
import { AuthorStub, BookDetail, ChapterListItem } from "prisma/prismaContext"
import { useState } from "react"
import CreateChapterModal, { OpenChapterModalButton } from "../Chapter/ChapterCreateModal"
import useApi from "prisma/useApi"
import AuthorAvatar from "components/ui/avatar/authorAvatar"

const { jsonBlock, debug } = useDebug("components/Books/BookDetailComponent","DEBUG")

export type BookViewProps = {
  bookDetail: BookDetail
  onUpdate?:  () => void
}

const BookDetailView = ({bookDetail, onUpdate}:BookViewProps) => {
  const {save} = useApi.book()

  const { notify } = useToast()
  const {cyfrUser, isLoading} = useApi.cyfrUser()

  const [back, setBack] = useState<string|null|undefined>(bookDetail.back)
  const [synopsis, setSynopsis] = useState<string|null|undefined>(bookDetail.synopsis)
  const isAuthor = cyfrUser ? (bookDetail.authors??[]).filter(a => a.user.id === cyfrUser?.id).length > 0 : false

  const update = async () => {
    debug('update')
    if (onUpdate) onUpdate()
  }

  const onGalleryUpsert = async (galleryId?:string) => {
    debug('onGalleryUpsert', galleryId)
    if (!galleryId) {
      notify('Hm that dint work', 'info')
      return
    }
    // TODO add gallery
    // const added = await bookApi.addGallery(galleryId)
    // if (added) {
    //   notify(`You created a gallery ${bookDetail.title}.`)
    // }
  }

  const editChapter =(chapter:ChapterListItem) => {
    const v = isAuthor ? '?v=edit' : ''
    //TODO: Don't leave this page with unsaved changes
    //TODO: add slug to chapter as a compound key
    router.push(`/book/${bookDetail.slug}/chapter/${chapter.id}${v}`)
  }

  const onSave = async () => {
    // @ts-ignore
    const success = await save({
      ...bookDetail
      ,back: back ||''
      ,synopsis: synopsis || ''
    })
    if (success) {
      notify('Saved!')
    } else {
      notify('There was a problem saving', 'warning')
    }
  }

  // TODO this should be handled by commune
  if (bookDetail && bookDetail.visible === false && isAuthor === false) return (
    <div>
      <h3>You do not have permissions to perform that action.</h3>
      <div>
        <label>Authors</label>
        {bookDetail.authors.map((a: AuthorStub) => (
          <AuthorAvatar author={a} sz="md" key={a.id} />
        ))}
      </div>
      <div>
        <label>Visibility</label>
        <div>{bookDetail.visible}</div>
      </div>
      <div>
        <label>Permission</label>
        <div>TBD</div>
      </div>
    </div>
  )

  return (
    <div>
      <BookDetailHeader bookDetail={bookDetail} onUpdate={update} />
      <div>
          <>
            <h3>Back</h3>
            <div className="my-4 font-ibarra">
              {isAuthor ? (
                <InlineTextarea
                  content={bookDetail.back}
                  setContent={setBack}
                  onSave={onSave}
                  />
              ) : 
              <HtmlContent content={bookDetail.back??''}/>
              }
            </div>
          </>
          <>
            <h3>Synopsis</h3>
            <div className="my-4">
              <div className="font-ibarra">
                {isAuthor ? (
                  <InlineTextarea
                    content={bookDetail.synopsis}
                    setContent={setSynopsis}
                    onSave={onSave}
                  />
                ) : (
                  <HtmlContent content={bookDetail.synopsis??''} />
                )}
              </div>
            </div>
          </>
          <>
            <h3>Chapters</h3>
            <div className="my-4">
              <h3>Chapters </h3>
              <div className="flex space-x-4">
                {isAuthor && 
                  <>
                    <OpenChapterModalButton variant="plus" />
                    <CreateChapterModal bookDetail={bookDetail} onSave={onSave} />
                  </>
                }
                <ChapterList chapters={bookDetail.chapters??[]} onSelect={editChapter} />
              </div>
            </div>
          </>
          <>
            <h3>Characters</h3>
            <div className="my-4">
              <h3>Characters{isAuthor && <OpenCharacterModalPlus />}</h3>
                {isAuthor && <CreateCharacterModal bookDetail={bookDetail} />}
                <div className="flex space-x-4">
                {/* <CharacterList characters={bookDetail.characters} /> */}
              </div>
            </div>
          </>
          <>
            <h3>Gallery</h3>
            <div className="my-4">
              <h3>Gallery {isAuthor && bookDetail.gallery===undefined ? <OpenGalleryModalPlus /> : <span>{PhotoIcon}</span> }</h3>
              <div>
              {(bookDetail.gallery || isAuthor) && (
                <GalleryCreateModal onUpsert={onGalleryUpsert} />
              )}
              </div>
              <GalleryPhotoswipe gallery={bookDetail.gallery} />
            </div>
          </>
      </div>
      {jsonBlock(bookDetail)}
    </div>
)}

export default BookDetailView
