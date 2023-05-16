import { Tab } from "@headlessui/react"
import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import { BookDetailHook } from "../../../hooks/useBookDetail"
import useDebug from "../../../hooks/useDebug"
import ErrorPage from "../../../pages/404"
import { BookDetail, Chapter } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import { InlineTextarea } from "../../forms"
import HtmlContent from "../../ui/htmlContent"
import {
  PhotoIcon
} from "../../ui/icons"
import Spinner from "../../ui/spinner"
import CreateChapterModal, { OpenChapterModalButton } from "../Chapter/ChapterCreateModal"
import ChapterList from "../Chapter/ChapterList"
import CreateCharacterModal, { OpenCharacterModalPlus } from "../Characters/CharacterCreateModal"
import CharacterList from "../Characters/CharacterList"
import GalleryCreateModal, { OpenGalleryModalPlus } from "../Gallery/GalleryCreateModal"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import BookDetailHeader from "./BookDetailHeader"

const { jsonBlock, debug } = useDebug(
  "components/Books/BookDetailComponent",
  "DEBUG"
)

type BookDetailViewProps = {
  bookDetailHook: BookDetailHook
}

const BookDetailView = ({bookDetailHook}:BookDetailViewProps) => {
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {bookDetail, setBookDetail, isLoading, error, by, isAuthor, invalidate} = bookDetailHook

  const [activeTab, setActiveTab] = useState(0)
  const selected = (tab:number) => `cursor-pointer hover:text-secondary transition-colors duration-300 ${activeTab === tab ? 'h-subtitle' : 'text-info'}`


  if (isLoading) return <Spinner />

  if (error) return <ErrorPage />

  const onGalleryUpsert = async (galleryId?:string) => {
    debug('onGalleryUpsert', galleryId)
    if (!galleryId) {
      notify('Hm that dint work', 'info')
      return
    }
    // const added = await bookApi.addGallery(galleryId)
    // if (added) {
    //   notify(`You created a gallery ${bookDetail?.title}.`)
    // }
  }

  const updatePanel = (html?: string | null) => {
    // bookApi.update({ props: {back: html?.toString()}, autoSave: true })
    // setSaveReady(true)
  }

  const updateSynopsis = (html?: string | null) => {
    // bookApi.update({props:{ synopsis: html?.toString()}, autoSave: true})
    // setSaveReady(true)
  }

  const editChapter =(chapter:Chapter) => {
    // const v = bookApi.isAuthor ? '?v=edit' : ''
    // //TODO: Don't leave this page with unsaved changes
    // //TODO: add slug to chapter as a compound key
    // router.push(`/book/${bookDetail?.slug}/chapter/${chapter.id}${v}`)
  }

  const onSave = () => {
    // bookApi.save()
    // invalidate()
  }

  return bookDetail ? (
    <div>
      <BookDetailHeader bookDetailHook={bookDetailHook} />

        <div>
          <Tab.Group vertical onChange={setActiveTab}>
            
            <Tab.List className='space-x-4 bg-info-content p-1 rounded-lg flex flex-grow justify-evenly'>
              {['Back','Synopsis','Chapters','Characters','Gallery'].map((t,i) => (
                <Tab as={Fragment} key={`tab-${t}-${i}`}><h3 className={selected(i)}>{t}</h3></Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {/* BACK PANEL */}
              <Tab.Panel>
                <div className="my-4 font-ibarra">
                    {isAuthor ? (
                      <InlineTextarea
                        content={bookDetail?.back}
                        setContent={updatePanel}
                        onSave={() => notify('This was changed to bookDetailHook')}
                      />
                    ) : 
                      <HtmlContent content={bookDetail?.back||''}/>
                    }
                </div>
              </Tab.Panel>
              
              {/* SYNOPSIS */}
              <Tab.Panel>
                <div className="my-4">
                  <h3>Synopsis</h3>
                  <div className="font-ibarra">
                    {isAuthor ? (
                      <InlineTextarea
                        content={bookDetail.synopsis}
                        setContent={updateSynopsis}
                        onSave={() => notify('This was changed to bookDetailHook')}
                      />
                    ) : (
                      <HtmlContent content={bookDetail.synopsis!} />
                    )}
                  </div>
                </div>
              </Tab.Panel>
              
              {/* CHAPTERS */}
              <Tab.Panel>
                <div className="my-4">
                  <h3>Chapters {isAuthor && <OpenChapterModalButton variant="plus" />}</h3>
                    {isAuthor && <CreateChapterModal bookDetailHook={bookDetailHook} onSave={onSave} />}
                  <div className="flex space-x-4">
                    <ChapterList bookDetailHook={bookDetailHook} onSelect={editChapter} />
                  </div>
                </div>
              </Tab.Panel>

              {/* CHARACTERS */}
              <Tab.Panel>                
                <div className="my-4">
                  <h3>Characters{isAuthor && <OpenCharacterModalPlus />}</h3>
                    {isAuthor && <CreateCharacterModal bookDetailHook={bookDetailHook} />}
                    <div className="flex space-x-4">
                    <CharacterList characters={bookDetail?.characters} />
                  </div>
                </div>

              </Tab.Panel>
              
              {/* GALLERY */}
              <Tab.Panel>
                <div className="my-4">
                  <h3>Gallery {isAuthor && bookDetail.gallery===undefined ? <OpenGalleryModalPlus /> : <span>{PhotoIcon}</span> }</h3>
                  <div>
                  {(bookDetail.gallery || isAuthor) && (
                    <GalleryCreateModal onUpsert={onGalleryUpsert} />
                  )}
                  </div>
                  <GalleryPhotoswipe gallery={bookDetail.gallery} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
    </div>
    
  )
  : <ErrorPage />
}

export default BookDetailView
