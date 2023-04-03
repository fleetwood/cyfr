import { useEffect, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { Gallery, Genre, GenreFeed, GenreListItem } from "../../../prisma/prismaContext"
import { sendApi } from "../../../utils/api"
import { useToast } from "../../context/ToastContextProvider"
import Dropzone, { CompleteFile } from "../../forms/Dropzone"
import TailwindInput from "../../forms/TailwindInput"
import GalleryUpsertForm from "../Gallery/GalleryUpsertForm"
import GalleryPhotoswipe from "../Gallery/GalleryPhotoswipe"
const {debug } = useDebug('components/containers/Genre/AddGenre')

type GenreAdminProps = {
    editGenre: GenreListItem|GenreFeed|Genre|null
}

const GenreAdmin = ({editGenre}:GenreAdminProps) => {
    const [title, setTitle] = useState<string|null>(null)
    const [description, setDescription] = useState<string|null>(null)
    const [gallery, setGallery] = useState<Gallery|null>(null)
    const [images, setImages] = useState<string[]>([])  
    const {notify} = useToast()

    useEffect(() => {
        setTitle(() => editGenre ? editGenre.title : null)
        setDescription(() => editGenre ? editGenre.description : null)
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
        const genre = await sendApi('genre/upsert', {title, description, gallery, images})
        if (genre.data.result) {
            debug('addGenre', {...genre.data.result})
            resetGenre()
            notify({type: 'success', message: `Genre ${genre.data.result.title} updated or created!`})
        }
    }

    const resetGenre = () => {
        setTitle(() => null)
        setDescription(() => null)
    }

    const deleteGenre = async () => {
        const success = await sendApi('genre/delete', {title})
        resetGenre()
    }
    
    const onFilesComplete = async (files: CompleteFile[]) => {
      const setFiles = files.flatMap((f) => f.secure_url)
      debug(`onFilesComplete`,setFiles)
      setImages((current) => [...current, ...setFiles])
    }

  return (
    <div className="m-4 p-4 rounded-lg border border-primary bg-base-200">
        <div>
            <h2>Edit Genres</h2>
            <TailwindInput type="text" label="Genre Title" placeholder="Make sure no typos! Title is used as a key" value={title} setValue={setTitle} />
            <TailwindInput type="text" label="Description" placeholder="Gotta give a description. HTMLInput forthcoming..." value={description} setValue={setDescription} />
            <GalleryUpsertForm label="Covers" gallery={gallery} className='pt-2' labelClassName="text-primary" variant='no-title' />
            {/* <Toggler checked={fiction} setChecked={setFiction} trueLabel="Non-Fiction" falseLabel="Fiction" variant="primary" /> */}
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