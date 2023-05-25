import { Tab } from "@headlessui/react"
import router from "next/router"
import { Fragment, useEffect, useState } from "react"
import useBookQuery from "../../../hooks/useBookQuery"
import useDebug from "../../../hooks/useDebug"
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
import { OpenCharacterModalPlus } from "../Characters/CharacterCreateModal"
import CharacterList from "../Characters/CharacterList"
import GalleryCreateModal, { OpenGalleryModalPlus } from "../Gallery/GalleryCreateModal"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import BookDetailHeader from "./BookDetailHeader"
import BookApi from "../../../prisma/api/bookApi"

const { jsonBlock, debug } = useDebug(
  "components/Books/BookDetailComponent",
  "DEBUG"
)

export type BookViewProps = {
  bookSlug:   string
  onUpdate?:  () => void
}

const BookDetailView = ({bookSlug, onUpdate}:BookViewProps) => {
  const {data, isLoading, error, invalidate} = useBookQuery(bookSlug)
  const [bookDetail, setBookDetail] = useState<BookDetail>(data)
  const {save} = BookApi()

  const { notify, loginRequired } = useToast()
  const [cyfrUser] = useCyfrUserContext()

  // For Tabs
  const [activeTab, setActiveTab] = useState(0)
  const selected = (tab:number) => `cursor-pointer hover:text-secondary transition-colors duration-300 ${activeTab === tab ? 'h-subtitle' : 'text-info'}`
  

  const [back, setBack] = useState<string|null|undefined>(bookDetail?.back)
  const [synopsis, setSynopsis] = useState<string|null|undefined>(bookDetail?.synopsis)

  // const {bookDetail, query, state, relations, api} = bookDetailHook
  
  const isAuthor = cyfrUser ? (bookDetail?.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0 : false

  // const {
  //   // RELATIONS, READ-ONLY
  //   genre, gallery, authors, cover, follows, likes, shares, chapters, characters, categories 
    
  // }:BookRelations = relations
  // useEffect(() => {
  //   setBack(bookDetail?.back)
  // }, [bookDetail])

  const update = async () => {
    debug('update')
    invalidate()
    if (onUpdate) onUpdate()
  }

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

  const updateSynopsis = (html?: string | null) => {
    // bookApi.update({props:{ synopsis: html?.toString()}, autoSave: true})
    // setSaveReady(true)
  }

  const editChapter =(chapter:Chapter) => {
    const v = isAuthor ? '?v=edit' : ''
    //TODO: Don't leave this page with unsaved changes
    //TODO: add slug to chapter as a compound key
    router.push(`/book/${bookDetail?.slug}/chapter/${chapter.id}${v}`)
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

  useEffect(() => {setBookDetail(data)}, [data])

  return  bookDetail ? 
    <div>
      <BookDetailHeader bookDetail={bookDetail} onUpdate={update} />

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
                        setContent={setBack}
                        onSave={onSave}
                        />
                    ) : 
                    <HtmlContent content={bookDetail.back??''}/>
                    }
                </div>
              </Tab.Panel>
              
              {/* SYNOPSIS */}
              <Tab.Panel>
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
              </Tab.Panel>
              
              {/* CHAPTERS */}
              <Tab.Panel>
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
              </Tab.Panel>

              {/* CHARACTERS */}
              <Tab.Panel>                
                <div className="my-4">
                  <h3>Characters{isAuthor && <OpenCharacterModalPlus />}</h3>
                    {/* {isAuthor && <CreateCharacterModal bookDetailHook={bookDetailHook} />} */}
                    <div className="flex space-x-4">
                    <CharacterList characters={bookDetail.characters} />
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
        {jsonBlock(bookDetail)}
    </div>
    : <div className='m-auto w-32 h-32' >
        <Spinner />
      </div>
}

export default BookDetailView
