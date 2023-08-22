import { useToast } from "components/context/ToastContextProvider"
import { TailwindInput } from "components/forms"
import useDebug from "hooks/useDebug"
import { CoverStub, GenreStub } from "prisma/prismaContext"
import { useEffect, useState } from "react"
import { sendApi } from "utils/api"
import CoverGenreEdit from "../Cover/CoverGenreEdit"
const {debug } = useDebug('components/containers/Genre/AddGenre')

type GenreAdminProps = {
    editGenre: GenreStub|null
}

const GenreAdmin = ({editGenre}:GenreAdminProps) => {
    const [title, setTitle] = useState<string|null>(null)
    const [description, setDescription] = useState<string|null>(null)
    const [covers, setCovers] = useState<CoverStub[]>([])
    const {notify} = useToast()

    useEffect(() => {
        setTitle(() => editGenre ? editGenre.title : null)
        setDescription(() => editGenre ? editGenre.description : null)
    },[editGenre])

    const upsertGenre = async () => {
        if (!title || !description) {
            debug('addGenre', 'Not valid!')
            return
        }
        const genre = await sendApi('genre/upsert', {title, description, covers})
        if (genre.data.result) {
            debug('addGenre', {...genre.data.result})
            resetGenre()
            notify(`Genre ${genre.data.result.title} updated or created!`)
        }
    }

    const resetGenre = () => {
        setTitle(() => null)
        setDescription(() => null)
        setCovers(() => [])
    }

    const deleteGenre = async () => {
        const success = await sendApi('genre/delete', {title})
        resetGenre()
    }
    
    const onAddCover = async () => {
        resetGenre()
    }

  return (
    <div className="m-4 p-4 rounded-lg border border-primary bg-base-200">
        <div>
            <h2>Edit Genres</h2>
            <TailwindInput type="text" label="Genre Title" placeholder="Make sure no typos! Title is used as a key" value={title} setValue={setTitle} />
            <TailwindInput type="text" label="Description" placeholder="Gotta give a description. HTMLInput forthcoming..." value={description} setValue={setDescription} />
            {editGenre && <CoverGenreEdit label="Covers" genre={editGenre} onUpdate={onAddCover} />}
            <div className="flex justify-between">
                <button className="btn btn-primary rounded-lg text-primary-content px-4" onClick={upsertGenre} disabled={title===null || description === null}>Adminstrate</button>
                <button className="btn btn-primary rounded-lg text-primary-content px-4" onClick={resetGenre} disabled={title===null}>Clear</button>
                <button className="btn btn-warning rounded-lg text-warning-content px-4" onClick={deleteGenre} disabled={title===null} >Delete</button>
            </div>
        </div>
    </div>
  )
}
export default GenreAdmin