import { Tab } from "@headlessui/react"
import { Fragment, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import ErrorPage from "../../../pages/404"
import { BookDetailHook, BookDetailApi, Chapter, BookDetailState, BookRelations } from "../../../prisma/prismaContext"
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

/**
 * 
 * @param bookDetailHook {@link BookDetailHook} see also {@link BookDetailApi}
 * @returns 
 */
const BookDetailView = ({bookDetailHook}:BookDetailViewProps) => {
  const { notify, loginRequired } = useToast()

  const [activeTab, setActiveTab] = useState(0)
  const selected = (tab:number) => `cursor-pointer hover:text-secondary transition-colors duration-300 ${activeTab === tab ? 'h-subtitle' : 'text-info'}`

  const {bookDetail, query, state, relations, api} = bookDetailHook

  const { 
    // READ-ONLY
    id, createdAt, isAuthor,
    // mutable states
    updatedAt, setUpdatedAt,
    startedAt, setStartedAt,
    completeAt, setCompleteAt,
    active, setActive,
    status, setStatus,
    prospect, setProspect,
    fiction, setFiction,
    title, setTitle,
    slug, setSlug,
    coverId, setCoverId,
    genreId, setGenreId,
    hook, setHook,
    synopsis, setSynopsis,
    back, setBack,
    galleryId, setGalleryId
  }:BookDetailState = state

  const {
    // RELATIONS, READ-ONLY
    genre, gallery, authors, cover, follows, likes, shares, chapters, characters, categories 
    
  }:BookRelations = relations

  if (bookDetailHook.query.isLoading) return <Spinner />
  if (bookDetailHook.query.error) return <ErrorPage error={bookDetailHook.query.error} />

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

  const updatePanel = async () => {
    debug('updatePanel', back)
    const success = await bookDetailHook.api.save(state.current)
    if (success) {
      notify('SAVED!!!!!!!!!!')
    } else {
      notify('No save.', 'warning')
    }
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

  return (
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
                        content={back}
                        setContent={setBack}
                        onSave={updatePanel}
                      />
                    ) : 
                      <HtmlContent content={back}/>
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
                        content={synopsis}
                        setContent={setSynopsis}
                        onSave={updateSynopsis}
                      />
                    ) : (
                      <HtmlContent content={synopsis} />
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
                    <CharacterList characters={characters} />
                  </div>
                </div>

              </Tab.Panel>
              
              {/* GALLERY */}
              <Tab.Panel>
                <div className="my-4">
                  <h3>Gallery {isAuthor && gallery===undefined ? <OpenGalleryModalPlus /> : <span>{PhotoIcon}</span> }</h3>
                  <div>
                  {(gallery || isAuthor) && (
                    <GalleryCreateModal onUpsert={onGalleryUpsert} />
                  )}
                  </div>
                  <GalleryPhotoswipe gallery={gallery} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
    </div>    
  )
}

export default BookDetailView
