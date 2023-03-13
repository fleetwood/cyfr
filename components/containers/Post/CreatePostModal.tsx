import { FormEvent, useState } from "react"
import useCyfrUser from "../../../hooks/useCyfrUser"
import { useToast } from "../../context/ToastContextProvider"
import { LoggedIn } from "../../ui/toasty"
import useFeed from "../../../hooks/useFeed"
import Dropzone, { CompleteFile } from "../../forms/Dropzone"
import RemirrorEditor from "../../ui/RemirrorEditor"
import useDebug from "../../../hooks/useDebug"

const {debug} = useDebug("components/containers/Post/CreatePost", 'DEBUG')

const CreatePostModal = (): JSX.Element => { 
  const createPostModal = 'createPostModal'
  const [cyfrUser] = useCyfrUser()
  const { notify } = useToast()
  const [content, setContent] = useState<string | null>(null)
  const [valid, setIsValid] = useState<boolean>(false)
  const { createPost, invalidateFeed } = useFeed({ type: "post" })
  const [images, setImages] = useState<string[]>([])


  const onFilesComplete = async (files: CompleteFile[]) => {
    const setFiles = files.flatMap((f) => f.secure_url)
    debug(`onFilesComplete`,setFiles)
    setImages((current) => [...current, ...setFiles])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid) {
      debug(`handleSubmit: sth is disabled....`, { cyfrUser, content })
      return
    }

    const postData = {
      content: content!,
      authorId: cyfrUser.id,
      images: images.flatMap((url) => url),
    }
    const post = await createPost(postData)

    if (!post) {
      notify({
        type: "warning",
        message: `Uh. Ya that didn't work. Weird.`,
      })
    } else {
      setContent(null)
      setImages(() => [])
      invalidateFeed()
    }
    const createModal = document.getElementById(createPostModal)
    // @ts-ignore
    createModal!.checked = false
  }

  return (
    <>
    <input type="checkbox" id={createPostModal} className="modal-toggle" />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-opacity-0 shadow-none overflow-visible scrollbar-hide">
        <label htmlFor={createPostModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div
          className="mb-3 rounded-xl w-full 
          bg-primary text-primary-content 
          md:bg-blend-hard-light md:bg-opacity-80
          "
        >
          {cyfrUser && (
            <div className="w-full mx-auto p-2 sm:p-6 lg:p-4">
              <form className=" flex flex-col" onSubmit={handleSubmit}>
                <i className="tw twa-black-cat" />
                <RemirrorEditor
                  content={content}
                  setContent={setContent}
                  maxChar={128}
                  setValid={setIsValid}
                />

                <Dropzone limit={5} onUploadComplete={onFilesComplete} />

                <div className="w-full grid place-items-end mt-2">
                  <button
                    disabled={!valid}
                    onClick={handleSubmit}
                    className="
                      btn lg:btn-sm p-2 bg-secondary text-primary-content
                      disabled:bg-warning disabled:bg-opacity-40 disabled:text-primary
                    "
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          )}
          {!cyfrUser && <LoggedIn />}
        </div>
      </div>
    </div>
    </>

  )
}
export default CreatePostModal
