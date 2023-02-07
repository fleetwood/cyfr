import { FormEvent, useEffect, useRef, useState } from "react"
import { log } from "../../../utils/log"
import { useToast } from "../../context/ToastContextProvider"
import useCyfrUser from "../../../hooks/useCyfrUser"
import useFeed from "../../../hooks/useFeed"
import { CyfrLogo } from "../../ui/icons"
import TailwindInput from "../../forms/TailwindInput"
import Dropzone, { CompleteFile } from "../../forms/Dropzone"

const GalleryCreateView = ({limit=-1}) => {
  const createGalleryModal = "createGalleryModal"
  const modal = useRef<HTMLInputElement>(null)
  const [checked, setChecked] = useState(false)

  const [cyfrUser] = useCyfrUser()
  const { notify } = useToast()
  
  const [title, setTitle] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [createEnabled, setCreateEnabled] = useState(false)
  
  const { createGallery, invalidateFeed } = useFeed({ type: "gallery" })

  const onFilesComplete = async (files: CompleteFile[]) => {
    const setFiles = files.flatMap(f => f.secure_url)
    log(`\tGalleryCreateView.onFilesComplete ${JSON.stringify(setFiles, null, 2)}`)
    setImages((current) => [...current, ...setFiles])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!cyfrUser) {
      return
    }
    const data = {
      authorId: cyfrUser.id,
      title,
      description,
      images
    }
    log(`GalleryCreateView.handleSubmit`, data)

    const gallery = await createGallery(data)
    if (!gallery) {
      notify({
        type: "warning",
        message: `Uh. Ya that didn't work. Weird.`,
      })
    } else {
      invalidateFeed()
      setTitle(null)
      setDescription(null)
      setImages([])
      setChecked(false)
      createGalleryModal
    }
  }

  useEffect(() => {
    setCreateEnabled(() => images.length>0)
  },[title, description, images])

  return (
    <>
    <input type="checkbox" ref={modal} id={createGalleryModal} className="modal-toggle" checked={checked} onChange={()=>{}} />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-opacity-0 shadow-none">
          <label onClick={() => setChecked(() => !checked)}  className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

          <div className="mb-3 rounded-xl w-full bg-primary text-primary-content md:bg-blend-hard-light md:bg-opacity-80">
            {cyfrUser && (
              <div className="w-full mx-auto p-2 sm:p-6 lg:p-4 drop-shadow-xl">
                <form className="flex flex-col space-y-2 bg-secondary p-2 rounded-lg drop-shadow-lg border border-base-100 border-opacity-50" onSubmit={() => {}}>
                  <TailwindInput
                    type="text"
                    label="Title (optional)"
                    value={title}
                    setValue={setTitle}
                    inputClassName="text-base-content"
                  />
                  <TailwindInput
                    type="text"
                    label="Description (Also optional)"
                    value={description}
                    setValue={setDescription}
                    inputClassName="text-base-content"
                  />
                  <Dropzone limit={limit>0?limit:10} onUploadComplete={onFilesComplete} />
                </form>
                <div className="w-full grid place-items-end mt-2">
                  <button
                    className="btn lg:btn-sm p-2 bg-secondary text-primary-content disabled:bg-opacity-40 disabled:text-primary"
                    onClick={handleSubmit}
                    disabled={!createEnabled}
                  >
                    Create!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <label onClick={() => setChecked(() => !checked)} className="btn btn-info space-x-2">
        <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
        <span className="text-info-content">Create a Gallery!</span>
      </label>
    </>
  )
}

export default GalleryCreateView
