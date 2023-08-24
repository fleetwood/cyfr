import useDebug from "hooks/useDebug"
import {
  AuthorStub,
  BookDetail,
  BookStatus,
  BookUpsertProps,
  Cover,
  Gallery,
  Image,
  UserStub
} from "prisma/prismaContext"
import { useState } from "react"
import { ItemProps } from "react-photoswipe-gallery"
import { KeyVal } from "types/props"
import { uuid } from "utils/helpers"

import { useToast } from "components/context/ToastContextProvider"
import { AutoInput, TailwindInput, TailwindTextarea } from "components/forms"
import Dropzone from "components/forms/Dropzone"
import EZButton from "components/ui/ezButton"
import Toggler from "components/ui/toggler"
import Link from "next/link"
import useApi from "prisma/useApi"
import GalleryPhotoswipe from "../Gallery/GalleryImages"

const { debug } = useDebug("components/containers/Books/UpsertBook")

type UpsertBookProps = {
  book?: BookDetail
  link?: boolean
  onUpsert?: Function
}

const UpsertBook = ({ book, onUpsert, link = false }: UpsertBookProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
  const { notify } = useToast()
  const {upsert} = useApi.book()

  const [genreList, setGenreList] = useState<any[]>([])
  const [coverGallery, setCoverGallery] = useState<Gallery | null>()

  const [title, setTitle] = useState<string | null>(book?.title || null)
  const [visible, setVisible] = useState<boolean>(book?.visible || false)
  const [prospect, setProspect] = useState<boolean>(book?.prospect || false)
  const [fiction, setFiction] = useState<boolean>(book?.fiction || true)
  const [status, setStatus] = useState<BookStatus>(book?.status || "DRAFT")
  const [cover, setCover] = useState<Cover|null>(book?.cover || null)
  const [genreId, setGenreId] = useState<string | null>(book?.genreId || null)
  // const [categories, setCategories] = useState<BookCategory[]>(book?.categories || [])
  const [hook, setHook] = useState<string | null>(book?.hook || null)
  const [synopsis, setSynopsis] = useState<string | null>(book?.synopsis || null)
  const [back, setBack] = useState<string | null>(book?.back || null)
  const [authors, setAuthors] = useState<AuthorStub[]>(book?.authors || [])
  // const [chapters, setChapters] = useState<Chapter[]>(book?.chapters || [])
  // const [characters, setCharacters] = useState<Character[]>(book?.characters || [])
  // const [gallery, setGallery] = useState<GalleryStub | null>(book?.gallery || null)
  const [images, setImages] = useState<string[]>([])

  const [showEditor, setShowEditor] = useState<boolean>(false)
  const toggle = () => {
    setShowEditor(() => !showEditor)
  }

  const saveBook = async () => {
    const bookProps:BookUpsertProps = {
      ...book,
      ownerId: cyfrUser.id,
      // TODO
      completeAt: undefined,
      title: title!,
      visible,
      prospect,
      status,
      fiction,
      genreId: genreId!,
      // categories,
      hook: hook ?? '',
      synopsis: synopsis ?? '',
      back: back ?? '',
      words:0,
      // cover,
      authors: authors!,
      //   permission
      //   chapters,
      //   characters,
      //   gallery,
    }
    const result = await upsert(bookProps)
    if (result) {
        notify(`Created ${title}! Happy writing!!`)
        if (onUpsert) onUpsert(book)
    }
    else {
        debug('Did not get right result?', bookProps)
        notify(`Ya that dint work`,'warning')
    }
  }

  const onFilesComplete = async (files: Image[]) => {
    const setFiles = files.flatMap((f) => f.url)
    debug(`onFilesComplete`, setFiles)
    setImages((current) => [...current, ...setFiles])
  }

  const selectGenre = async (p: KeyVal) => {
    const genrid = p.value,
      gal = genreList.find((g) => g.id == genrid).gallery

    debug("selectGenre", { p, genrid, gal })
    setGenreId(() => (p.value ? p.value.toString() : null))
    // setCoverGallery(() => genreList.find(g => g.id == p.value).gallery)
  }

  const selectCover = (item: ItemProps) => {
    debug("selectCover", { item })
  }

  return (
    <div className="bg-base-100 rounded-lg p-4">
      {link && book?.slug
        ? <Link href={`/book/${book.slug}`} ><h2 className="h-subtitle">{book.title}</h2></Link>
        : <h2 className="h-subtitle">{book?.title ?? "New Book"}</h2>
      }
      {showEditor && (
        <div className="flex flex-col space-y-4">
          <TailwindInput
            value={title}
            setValue={setTitle}
            type="text"
            label="Title"
            placeholder="A good name makes all the difference"
            required={true}
          />
          <TailwindTextarea
            value={hook}
            setValue={setHook}
            label="Hook"
            placeholder="A catchy blurb that grabs the reader's eye"
          />
          <TailwindTextarea
            value={synopsis}
            setValue={setSynopsis}
            label="Synopsis"
            placeholder="Tell an agent what the book is about"
          />
          <TailwindTextarea
            value={back}
            setValue={setBack}
            label="Back"
            placeholder="The back panel Tell the reader what the book is about"
          />
          <div>
            <span className=" text-primary font-bold">Genre</span>
            <AutoInput
              key={uuid()}
              options={genreList.map((g) => {
                return { key: g.title, value: g.id }
              })}
              onUpdate={selectGenre}
            />
            {coverGallery && (
              <div>
                <h3>Cover Gallery</h3>
                <GalleryPhotoswipe
                  gallery={coverGallery}
                  onSelect={selectCover}
                />
                <p>--or upload your own--</p>
                <Dropzone limit={1} onDropComplete={onFilesComplete} />
              </div>
            )}
          </div>
          <div className="w-1/2">
            <Toggler
              checked={visible}
              setChecked={setVisible}
              falseLabel="Not Visible"
              trueLabel="Visible"
            />
          </div>
          <div className="w-1/2">
            <Toggler
              checked={prospect}
              setChecked={setProspect}
              falseLabel="No Agents"
              trueLabel="Agents"
            />
          </div>
        </div>
      )}
      {!showEditor && book && (
        <>
            {/* <div>Cover: {book.cover?.url ? <img src={cloudinary.thumb({url: book.cover.url, width: 100})} width={100} /> : <span>No Cover</span>}</div> */}
            <div>Cover: <span>TO DO</span></div>
            <div>GENRE: <span>TO DO</span></div>
            <div>Status: {book.status}</div>
            <div>Word count: {book.words}</div>
            <div>Visible: {book.visible ? 'Yes' : 'Hidden'}</div>
            <div>Agents: {book.prospect ? 'Will consider' : 'Not looking for representation'}</div>
            <div>{book.hook}</div>
            <div>{book.synopsis}</div>
            <div>Chapters: <span>TO DO</span></div>
            <div>Characters: <span>TO DO</span></div>
        </>
      )}
      <div className="flex justify-between my-4">
        {!showEditor && <EZButton label={book ? 'Edit' : 'Create'} onClick={toggle} />}
        {showEditor && <EZButton label="Save" onClick={saveBook} />}
        {showEditor && (
          <EZButton label="Cancel" variant="warning" onClick={toggle} />
        )}
      </div>
    </div>
  )
}
export default UpsertBook
