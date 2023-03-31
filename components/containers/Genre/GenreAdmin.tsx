import { useEffect, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { Genre, GenreFeed, GenreListItem } from "../../../prisma/prismaContext"
import { sendApi } from "../../../utils/api"
import { useToast } from "../../context/ToastContextProvider"
import TailwindInput from "../../forms/TailwindInput"
import Toggler from "../../ui/toggler"
const {debug } = useDebug('components/containers/Genre/AddGenre')

type GenreAdminProps = {
    editGenre: GenreListItem|GenreFeed|Genre|null
}

const GenreAdmin = ({editGenre}:GenreAdminProps) => {
    const [title, setTitle] = useState<string|null>(null)
    const [description, setDescription] = useState<string|null>(null)
    const [fiction, setFiction] = useState<boolean>(false)
    const {notify} = useToast()

    useEffect(() => {
        setTitle(() => editGenre ? editGenre.title : null)
        setDescription(() => editGenre ? editGenre.description : null)
        setFiction(() => editGenre ? editGenre.fiction : false)
    },[editGenre])

    const restoreGenres = async () => {
        const genre = await sendApi('genre/restore', {})
        notify({
            type: genre.status == 200 ? 'success' : 'warning',
            message: genre.status == 200 ? 'Genres restored!!' : 'Error restoring genres....'
        })
    }

    const upsertGenre = async () => {
        if (!title || !description) {
            debug('addGenre', 'Not valid!')
            return
        }
        const genre = await sendApi('genre/upsert', {title, description, fiction})
        if (genre.data.result) {
            debug('addGenre', {...genre.data.result})
            resetGenre()
            notify({type: 'success', message: `Genre ${genre.data.result.title} updated or created!`})
        }
    }

    const resetGenre = () => {
        setTitle(() => null)
        setDescription(() => null)
        setFiction(() => false)
    }

    const deleteGenre = async () => {
        const success = await sendApi('genre/delete', {title})
        resetGenre()
    }

  return (
    <div className="m-4 p-4 rounded-lg border border-primary bg-base-200">
        <div>
            <h2>Edit Genres</h2>
            <TailwindInput type="text" label="Genre Title" placeholder="Make sure no typos! Title is used as a key" value={title} setValue={setTitle} />
            <TailwindInput type="text" label="Description" placeholder="Gotta give a description. HTMLInput forthcoming..." value={description} setValue={setDescription} />
            <Toggler checked={fiction} setChecked={setFiction} trueLabel="Non-Fiction" falseLabel="Fiction" variant="primary" />
            <div className="flex justify-between">
                <button className="btn btn-primary rounded-lg text-primary-content px-4" onClick={upsertGenre} disabled={title===null || description === null}>Adminstrate</button>
                <button className="btn btn-primary rounded-lg text-primary-content px-4" onClick={resetGenre} disabled={title===null}>Clear</button>
                <button className="btn btn-warning rounded-lg text-warning-content px-4" onClick={deleteGenre} disabled={title===null} >Delete</button>
            </div>
        </div>
        <div>
            <h2>Restore Defaults</h2>
            <button className="btn btn-primary rounded-lg text-primary-content px-4" onClick={restoreGenres}>Restore</button>
        </div>
    </div>
  )
}
export default GenreAdmin