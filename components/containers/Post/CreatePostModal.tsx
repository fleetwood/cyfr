import { FormEvent, useState } from "react"
import useDebug from "hooks/useDebug"
import useFeed from "hooks/useFeed"

import { Image } from "prisma/prismaContext"
import { CyfrLogo } from "components/ui/icons"
import { useToast } from "components/context/ToastContextProvider"
import { Dropzone, SocialTextarea } from "components/forms"
import { LoggedIn } from "components/ui/toasty"
import { useCyfrUserContext } from "components/context/CyfrUserProvider"
import useApi from "prisma/useApi"

const {debug} = useDebug("components/containers/Post/CreatePost")
const createPostModal = 'createPostModal'

export const CreatePostModalButton = () => (
  <label htmlFor={createPostModal} className="btn btn-info space-x-2">
    <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
    <span className="text-info-content">New Post</span>
  </label>
)

const CreatePostModal = (): JSX.Element => { 
  const {cyfrUser} = useApi.cyfrUser()
  const { notify } = useToast()
  const [content, setContent] = useState<string | null>(null)
  const [valid, setIsValid] = useState<boolean>(false)
  const {invalidate} = useFeed('post')
  const {createPost } = useApi.post()
  const [images, setImages] = useState<Image[]>([])

  const onFilesComplete = async(files: Image[]) => {
    setImages((current) => [...current, ...files])
  }

  const toggleModal = (show?:boolean) => {
    const createModal = document.getElementById(createPostModal)
    // @ts-ignore
    createModal!.checked = show || false
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
      creatorId: cyfrUser.id,
      images: images,
    }
    const post = await createPost(postData)

    if (!post) {
      notify(`Uh. Ya that didn't work. Weird.`,'warning')
    } else {
      setContent(null)
      setImages(() => [])
      invalidate()
    }

    toggleModal()
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
                <SocialTextarea
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
