import { useEffect, useState } from "react"
import { ItemProps } from "react-photoswipe-gallery"
import useDebug from "../../../hooks/useDebug"
import Image from 'next/image'
import {
  BookCategory,
  BookDetail,
  BookStatus,
  Chapter,
  Character,
  Gallery,
  User,
  UserStub,
} from "../../../prisma/prismaContext"
import { KeyVal } from "../../../types/props"
import { getApi, sendApi } from "../../../utils/api"
import { uuid } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Dropzone from "../../forms/Dropzone"
import { CompleteFile } from "../../forms/Dropzone/types.defs"

import { useToast } from "../../context/ToastContextProvider"
import AutoInput from "../../forms/AutoInput"
import TailwindInput from "../../forms/TailwindInput"
import TailwindTextarea from "../../forms/TailwindTextarea"
import EZButton from "../../ui/ezButton"
import Toggler from "../../ui/toggler"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
import { cloudinary } from "../../../utils/cloudinary"
import Link from "next/link"

const { debug } = useDebug("components/containers/Books/UpsertBook", "DEBUG")

type UpsertBookProps = {
  book?: BookDetail
  link?: boolean
  onUpsert?: Function
}

const UpsertBook = ({ book, onUpsert, link = false }: UpsertBookProps) => {
  const [cyfrUser] = useCyfrUserContext()
  const { notify } = useToast()

  const [genreList, setGenreList] = useState<any[]>([])
  const [coverGallery, setCoverGallery] = useState<Gallery | null>()

  const [title, setTitle] = useState<string | null>(book?.title || null)
  const [active, setActive] = useState<boolean>(book?.active || false)
  const [prospect, setProspect] = useState<boolean>(book?.prospect || false)
  const [status, setStatus] = useState<BookStatus>(book?.status || "DRAFT")
  // const [cover, setCover] = useState<string|null>(book?.cover || null)
  const [genreId, setGenreId] = useState<string | null>(book?.genreId || null)
  const [categories, setCategories] = useState<BookCategory[]>(
    book?.categories || []
  )
  const [hook, setHook] = useState<string | null>(book?.hook || null)
  const [synopsis, setSynopsis] = useState<string | null>(
    book?.synopsis || null
  )
  const [back, setBack] = useState<string | null>(book?.back || null)
  const [words, setWords] = useState<number>(book?.words || 0)
  const [authors, setAuthors] = useState<UserStub[]>(book?.authors || [])
  const [chapters, setChapters] = useState<Chapter[]>(book?.chapters || [])
  const [characters, setCharacters] = useState<Character[]>(
    book?.characters || []
  )
  const [gallery, setGallery] = useState<Gallery | null>(book?.gallery || null)
  const [images, setImages] = useState<string[]>([])

  const [showEditor, setShowEditor] = useState<boolean>(false)
  const toggle = () => {
    setShowEditor(() => !showEditor)
  }

  const saveBook = async () => {
    const bookProps = {
      title,
      active,
      prospect,
      status,
      genreId,
      categories,
      hook,
      synopsis,
      back,
      words,
      authors,
    //   chapters,
    //   characters,
    //   gallery,
    }
    const upsert = await (await sendApi("book/upsert", bookProps)).data
    if (upsert.result) {
        const book = upsert.result
        notify({message: `Created ${book.title}! Happy writing!!`})
        if (onUpsert) onUpsert(book)
    }
    else {
        debug('Did not get right result?', upsert.result)
        notify({type: 'warning', message: `Ya that dint work`})
    }
  }

  const onFilesComplete = async (files: CompleteFile[]) => {
    const setFiles = files.flatMap((f) => f.secure_url)
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

  useEffect(() => {
    const getGenres = async () => {
      const genres = await getApi("/genre/list")
      if (genres && genres.result) {
        const g = genres.result
        setGenreList(() => g)
      }
    }
    getGenres()
    setAuthors(() => cyfrUser 
      ? [
          ...authors,
          {id: cyfrUser.id, name: cyfrUser.name, image: cyfrUser.image} as UserStub
        ]
      : authors
    )
  }, [])

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
                  onClick={selectCover}
                />
                <p>--or upload your own--</p>
                <Dropzone limit={1} onDropComplete={onFilesComplete} />
              </div>
            )}
          </div>
          <div className="w-1/2">
            <Toggler
              checked={active}
              setChecked={setActive}
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
            <div>Cover: {book.cover?.url ? <img src={cloudinary.thumb({url: book.cover.url, width: 100})} width={100} /> : <span>No Cover</span>}</div>
            <div>{book.genre.title}</div>
            <div>Status: {book.status}</div>
            <div>Word count: {book.words}</div>
            <div>Active: {book.active ? 'Yes' : 'Hidden'}</div>
            <div>Agents: {book.prospect ? 'Will consider' : 'Not looking for representation'}</div>
            <div>{book.hook}</div>
            <div>{book.synopsis}</div>
            <div>Chapters</div>
            <div>Characters</div>
        </>
      )}
      <div className="flex justify-between my-4">
        {!showEditor && <EZButton label={book ? 'Edit' : 'Create'} whenClicked={toggle} />}
        {showEditor && <EZButton label="Save" whenClicked={saveBook} />}
        {showEditor && (
          <EZButton label="Cancel" variant="warning" whenClicked={toggle} />
        )}
      </div>
    </div>
  )
}
export default UpsertBook
