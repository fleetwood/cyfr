import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { BookApi, BookCategory, BookStatus, Chapter, Character, UserStub } from "../../../prisma/prismaContext"
import { KeyVal } from "../../../types/props"
import {
  uniqueKey,
  uuid,
  valToLabel,
  ymd
} from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import { InlineTextarea, TailwindSelectInput } from "../../forms"
import Avatar from "../../ui/avatar"
import EZButton from "../../ui/ezButton"
import {
  FireIcon,
  FollowIcon,
  HeartIcon,
  PhotoIcon,
  QuestionMarkIcon,
  ReplyIcon,
  ShareIcon
} from "../../ui/icons"
import ShrinkableIconLabel from "../../ui/shrinkableIconLabel"
import Spinner from "../../ui/spinner"
import Toggler from "../../ui/toggler"
import CreateChapterModal, { OpenChapterModalButton } from "../Chapter/ChapterCreateModal"
import ChapterList from "../Chapter/ChapterList"
import CreateCharacterModal, { OpenCharacterModalPlus } from "../Characters/CharacterCreateModal"
import CharacterList from "../Characters/CharacterList"
import GalleryCreateModal, { OpenGalleryModalPlus } from "../Gallery/GalleryCreateModal"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import BookCover, { BookCoverVariant } from "./BookCover"
import HtmlContent from "../../ui/htmlContent"
import ErrorPage from "../../../pages/404"
import BookDetailHeader from "./BookDetailHeader"
import { Tab, Transition } from "@headlessui/react"

const { jsonBlock, debug } = useDebug(
  "components/Books/BookDetailComponent",
  "DEBUG"
)

/**
 * Description placeholder
 * @date 5/1/2023 - 12:38:57 PM
 *
 * @typedef {BookDetailComponentProps}
 * @param {bookApi:BookApi} {@link BookApi}
 */
type BookDetailComponentProps = {
  bookApi: BookApi
}

const BookDetailComponent = ({bookApi}:BookDetailComponentProps) => {
  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()
  const {bookDetail, isLoading, error, invalidate, isAuthor} = bookApi
  const [saveReady, setSaveReady] = useState(false)
  const router = useRouter()

  const [activeTab, setActiveTab] = useState(0)
  const selected = (tab:number) => `cursor-pointer hover:text-secondary transition-colors duration-300 ${activeTab === tab ? 'h-subtitle' : 'text-info'}`


  if (isLoading) return <Spinner />

  //TODO create an error page
  if (error) return <ErrorPage />

  const onGalleryUpsert = async (galleryId?:string) => {
    debug('onGalleryUpsert', galleryId)
    if (!galleryId) {
      notify('Hm that dint work', 'info')
      return
    }
    const added = await bookApi.addGallery(galleryId)
    if (added) {
      notify(`You created a gallery ${bookDetail?.title}.`)
    }
  }

  const updatePanel = (html?: string | null) => {
    bookApi.update({ props: {back: html?.toString()}, autoSave: true })
    setSaveReady(true)
  }

  const updateSynopsis = (html?: string | null) => {
    bookApi.update({props:{ synopsis: html?.toString()}, autoSave: true})
    setSaveReady(true)
  }

  const editChapter =(chapter:Chapter) => {
    const v = bookApi.isAuthor ? '?v=edit' : ''
    //TODO: Don't leave this page with unsaved changes
    //TODO: add slug to chapter as a compound key
    router.push(`/book/${bookDetail?.slug}/chapter/${chapter.id}${v}`)
  }

  const onSave = () => {
    bookApi.save()
    invalidate()
  }

  return bookDetail ? (

    <div>
      <BookDetailHeader bookApi={bookApi} />

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
                        content={bookDetail.back}
                        setContent={updatePanel}
                        onSave={bookApi.save}
                      />
                    ) : 
                      <HtmlContent content={bookDetail.back||''}/>
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
                        onSave={bookApi.save}
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
                    {isAuthor && <CreateChapterModal forBook={bookApi} onSave={onSave} />}
                  <div className="flex space-x-4">
                    <ChapterList forBook={bookApi} onSelect={editChapter} />
                  </div>
                </div>
              </Tab.Panel>

              {/* CHARACTERS */}
              <Tab.Panel>                
                <div className="my-4">
                  <h3>Characters{isAuthor && <OpenCharacterModalPlus />}</h3>
                    {isAuthor && <CreateCharacterModal forBook={bookApi} />}
                    <div className="flex space-x-4">
                    <CharacterList characters={bookApi.bookDetail?.characters} />
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

export default BookDetailComponent
