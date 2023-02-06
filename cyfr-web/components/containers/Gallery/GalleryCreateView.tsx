import { FormEvent, useEffect, useState } from "react"
import { log } from "../../../utils/log"
import { useToast } from "../../context/ToastContextProvider"
import useCyfrUser from "../../../hooks/useCyfrUser"
import useFeed from "../../../hooks/useFeed"
import { CyfrLogo } from "../../ui/icons"
import TailwindInput from "../../forms/TailwindInput"
import Dropzone, { CompleteFile } from "../../forms/Dropzone"

type GalleryCreateViewProps = {}

const GalleryCreateView = () => {
  const createGalleryModal = "createGalleryModal"
  const [cyfrUser] = useCyfrUser()
  const { notify } = useToast()
  const [title, setTitle] = useState<string | null>(null)
  const [description, setDescription] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const { createGallery, invalidateFeed } = useFeed({ type: "gallery" })

  const onFilesComplete = async (file: CompleteFile) => {
    if (file.secure_url) {
      log(`\tonFileComplete ${JSON.stringify(file, null, 2)}`)
      setImages((current) => [...current.filter(c => c!==file.secure_url), file.secure_url])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!cyfrUser) {
      return
    }

    const gallery = await createGallery({
      authorId: cyfrUser.id,
      title,
      description,
    })

    if (!gallery) {
      notify({
        type: "warning",
        message: `Uh. Ya that didn't work. Weird.`,
      })
    } else {
      invalidateFeed()
    }
  }

  return (
    <>
      <input type="checkbox" id={createGalleryModal} className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-opacity-0 shadow-none">
          <label
            htmlFor={createGalleryModal}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>

          <div
            className="mb-3 rounded-xl w-full 
            bg-primary text-primary-content 
            md:bg-blend-hard-light md:bg-opacity-80
            "
          >
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
                  <div className="flex text-base-content space-x-2">
                    {images.length > 0 && images.map(image => 
                        <>{image}</>
                    )}
                  </div>
                  <Dropzone
                    limit={1}
                    onFileCompleted={onFilesComplete}
                  ></Dropzone>
                </form>
                <div className="w-full grid place-items-end mt-2">
                  <button
                    className="btn lg:btn-sm p-2 bg-secondary text-primary-content disabled:bg-opacity-40 disabled:text-primary"
                    onClick={handleSubmit}
                  >
                    Create!
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <label htmlFor={createGalleryModal} className="btn btn-info space-x-2">
        <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
        <span className="text-info-content">Create a Gallery!</span>
      </label>
    </>
  )
}

export default GalleryCreateView
