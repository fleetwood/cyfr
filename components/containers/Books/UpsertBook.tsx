import { useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { BookCategory, BookDetail, BookStatus, Chapter, Character, Gallery, Genre, User } from "../../../prisma/prismaContext"
import TailwindInput from "../../forms/TailwindInput"
import EZButton from "../../ui/ezButton"
import Toggler from "../../ui/toggler"

const {debug} = useDebug('UpsertBook','DEBUG')

type UpsertBookProps = {
    book?: BookDetail
}

const UpsertBook = ({book}:UpsertBookProps) => {
    const [title, setTitle] = useState<string|null>(book?.title || null)
    const [active, setActive] = useState<boolean>(book?.active || false)
    const [prospect, setProspect] = useState<boolean>(book?.prospect || false)
    const [status, setStatus] = useState<BookStatus>(book?.status || 'DRAFT')
    const [cover, setCover] = useState<string|null>(book?.cover || null)
    const [genre, setGenre] = useState<Genre|null>(book?.genre || null)
    const [categories, setCategories] = useState<BookCategory[]>(book?.categories || [])
    const [hook, setHook] = useState<string|null>(book?.hook || null)
    const [synopsis, setSynopsis] = useState<string|null>(book?.synopsis || null)
    const [back, setBack] = useState<string|null>(book?.back || null)
    const [words, setWords] = useState<number>(book?.words || 0)
    const [authors, setAuthors] = useState<User[]>(book?.authors || [])
    const [chapters, setChapters] = useState<Chapter[]>(book?.chapters || [])
    const [characters, setCharacters] = useState<Character[]>(book?.characters || [])
    const [gallery, setGallery] = useState<Gallery|null>(book?.gallery || null)

    const [showEditor, setShowEditor] = useState<boolean>(false)
    const toggle = () => {
        setShowEditor(() => !showEditor)
    }

    const saveBook = () => {
        debug('saveBook', {
            title, active, prospect, status, cover, genre,categories, hook, synopsis, back, words, authors, chapters, characters, gallery
        })
    }

  return (
    <div className="bg-base-100 rounded-lg p-4">
        <h2 className="h-subtitle">{book ? book.title : 'New Book'}</h2>
        {showEditor && 
        <div className="flex flex-col space-y-4">
            <TailwindInput value={title} setValue={setTitle} type='text' label="Title" placeholder="A good name makes all the difference" />
            <TailwindInput value={hook} setValue={setHook} type='text' label="Hook" placeholder="A catchy blurb that grabs the reader's eye" />
            <TailwindInput value={synopsis} setValue={setSynopsis} type='text' label="Synopsis" placeholder="Tell an agent what the book is about" />
            <TailwindInput value={back} setValue={setBack} type='text' label="Back" placeholder="The back panel; Tell the reader what the book is about" />
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