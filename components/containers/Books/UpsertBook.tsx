import { useEffect, useState } from "react"
import { ItemProps } from "react-photoswipe-gallery"
import useDebug from "../../../hooks/useDebug"
import { BookCategory, BookDetail, BookStatus, Chapter, Character, Gallery, User } from "../../../prisma/prismaContext"
import { KeyVal } from "../../../types/props"
import { getApi } from "../../../utils/api"
import { uuid } from "../../../utils/helpers"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Dropzone from "../../forms/Dropzone"
import { CompleteFile } from "../../forms/Dropzone/types.defs"

import TailwindInput from "../../forms/TailwindInput"
import AutoInput from "../../ui/autoInput"
import EZButton from "../../ui/ezButton"
import Toggler from "../../ui/toggler"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"

const {debug} = useDebug('UpsertBook','DEBUG')

type UpsertBookProps = {
    book?: BookDetail
}

const UpsertBook = ({book}:UpsertBookProps) => {
    const [cyfrUser] = useCyfrUserContext()

    const [genreList , setGenreList] = useState<any[]>([])
    const [coverGallery, setCoverGallery] = useState<Gallery|null>()

    const [title, setTitle] = useState<string|null>(book?.title || null)
    const [active, setActive] = useState<boolean>(book?.active || false)
    const [prospect, setProspect] = useState<boolean>(book?.prospect || false)
    const [status, setStatus] = useState<BookStatus>(book?.status || 'DRAFT')
    // const [cover, setCover] = useState<string|null>(book?.cover || null)
    const [genreId, setGenreId] = useState<string|null>(book?.genreId || null)
    const [categories, setCategories] = useState<BookCategory[]>(book?.categories || [])
    const [hook, setHook] = useState<string|null>(book?.hook || null)
    const [synopsis, setSynopsis] = useState<string|null>(book?.synopsis || null)
    const [back, setBack] = useState<string|null>(book?.back || null)
    const [words, setWords] = useState<number>(book?.words || 0)
    const [authors, setAuthors] = useState<User[]>(book?.authors || [])
    const [chapters, setChapters] = useState<Chapter[]>(book?.chapters || [])
    const [characters, setCharacters] = useState<Character[]>(book?.characters || [])
    const [gallery, setGallery] = useState<Gallery|null>(book?.gallery || null)
    const [images, setImages] = useState<string[]>([])

    const [showEditor, setShowEditor] = useState<boolean>(false)
    const toggle = () => {
        setShowEditor(() => !showEditor)
    }

    const saveBook = () => {
        debug('saveBook', {
            title, active, prospect, status, genreId ,categories, hook, synopsis, back, words, authors, chapters, characters, gallery
        })
    }

    const onFilesComplete = async (files: CompleteFile[]) => {
        const setFiles = files.flatMap((f) => f.secure_url)
        debug(`onFilesComplete`,setFiles)
        setImages((current) => [...current, ...setFiles])
    }

    const selectGenre = async (p:KeyVal) => {
        const genrid = p.value
            , gal = genreList.find(g => g.id == genrid).gallery

        debug('selectGenre', {p, genreList, genrid, gal})
        setGenreId(() => p.value ? p.value.toString() : null)
        // setCoverGallery(() => genreList.find(g => g.id == p.value).gallery)
    }

    const selectCover = (item:ItemProps) => {
        debug('selectCover', {item})
    }

    useEffect(() => {
        const getGenres = async () => {
            const genres = await getApi('/genre/list')
            if (genres && genres.result) {
                const g = genres.result
                setGenreList(() => g) 
                // todo: this should be a gallery now
                // there should be a GalleryPhotoswip that just accepts a Gallery
                // setCoverList(() => g.map((g:GenreListItem):Image => {
                //     //todo: this is hard-coded for now, but Covers should probably tie to an Image, or Image should have type: 'cover'
                //     return {
                //         url: g.covers[0].url,
                //         height: 675,
                //         width: 426,
                //         id: uuid(),
                //         createdAt: now(),
                //         updatedAt: now(),
                //         visible: true,
                //         title: g.title,
                //         galleryId: null,
                //         postId: null,
                //         shareId: null,
                //         authorId: '',
                //     }
                // })) 
            }
        }
        getGenres()
    }, [])

  return (
    <div className="bg-base-100 rounded-lg p-4">
        <h2 className="h-subtitle">{book ? book.title : 'New Book'}</h2>
        {showEditor && 
        <div className="flex flex-col space-y-4">
            <TailwindInput value={title} setValue={setTitle} type='text' label="Title" placeholder="A good name makes all the difference" />
            <TailwindInput value={hook} setValue={setHook} type='text' label="Hook" placeholder="A catchy blurb that grabs the reader's eye" />
            <TailwindInput value={synopsis} setValue={setSynopsis} type='text' label="Synopsis" placeholder="Tell an agent what the book is about" />
            <TailwindInput value={back} setValue={setBack} type='text' label="Back" placeholder="The back panel; Tell the reader what the book is about" />
            <div>
                <span className=' text-primary font-bold'>Genre</span>
                <AutoInput key={uuid()} options={genreList.map((g) => { return {key: g.title, value: g.id}})} onUpdate={selectGenre} />
                {coverGallery &&
                    <div>
                        <h3>Cover Gallery</h3>
                        <GalleryPhotoswipe gallery={coverGallery} onClick={selectCover} />
                        <p>--or upload your own--</p>
                        <Dropzone limit={1} onUploadComplete={onFilesComplete} />
                    </div>
                }
            </div>
            <div className="w-1/2">
                <Toggler checked={active} setChecked={setActive} falseLabel='Not Visible' trueLabel="Visible" />
            </div>
            <div className="w-1/2">
                <Toggler checked={prospect} setChecked={setProspect} falseLabel='No Agents' trueLabel="Agents" />
            </div>
        </div>
        }
        <div className="flex justify-between my-4">
            {!showEditor &&
            <EZButton label='Create' whenClicked={toggle} />
            }
            {showEditor &&
            <EZButton label='Save' whenClicked={saveBook} />
            }
            {showEditor &&
            <EZButton label='Cancel' variant="warning" whenClicked={toggle} />
            }
        </div>
    </div>
  )
}
export default UpsertBook