import { FormEvent, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import useFeed from "../../../hooks/useFeed"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import Dropzone from "../../forms/Dropzone"
import RemirrorEditor from "../../forms/SocialTextarea"
import { CyfrLogo } from "../../ui/icons"
import { LoggedIn } from "../../ui/toasty"
import { Image } from "./../../../prisma/prismaContext"

const {debug} = useDebug("components/containers/Post/CreatePost")
const createPostModal = 'createPostModal'

export const CreatePostModalButton = () => (
  <label htmlFor={createPostModal} className="btn btn-info space-x-2">
    <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
    <span className="text-info-content">New Post</span>
  </label>
)

const CreatePostModal = (): JSX.Element => { 
  const [cyfrUser] = useCyfrUserContext()
  const { notify } = useToast()
  const [content, setContent] = useState<string | null>(null)
  const [valid, setIsValid] = useState<boolean>(false)
  const { createPost, invalidateFeed } = useFeed({ type: "post" })
  const [images, setImages] = useState<Image[]>([])

  const onFilesComplete = async(files: Image[]) => {
    setImages((current) => [...current, ...files])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid) {
      debug(`handleSubmit: sth is disabled....`, { cyfrUser, content })
      return
    }
    debug('handleSubmit', images)
    const postData = {
      content: content!,
      authorId: cyfrUser.id,
      images: images,
    }
    const post = await createPost(postData)

    if (!post) {
      notify(`Uh. Ya that didn't work. Weird.`,'warning')
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
                  maxChar={512}
                  setValid={setIsValid}
                />

                <Dropzone limit={5} onDropComplete={onFilesComplete} />

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
