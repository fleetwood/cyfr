import { FormEvent, useEffect, useState } from "react"
import useCyfrUser, { useCyfrUserProps } from "../../../hooks/useCyfrUser"
import { sendApi } from "../../../utils/api"
import { log } from "../../../utils/log"
import { useToast } from "../../context/ToastContextProvider"
import TailwindTextarea from "../../forms/TailwindTextarea"
import { LoggedIn } from "../../ui/toasty"
import useFeed from "../../../hooks/useFeed"
import GalleryCreatePage from "../../../pages/gallery/create"
import GalleryCreateView from '../Gallery/GalleryCreateView';
import Dropzone, { CompleteFile } from "../../forms/Dropzone"
import SimpleQuill from '../../ui/SimpleQuill';

type CreatePostProps = {
  onCreate: () => void
}

const CreatePost = ({ onCreate }: CreatePostProps): JSX.Element => {
  const [cyfrUser] = useCyfrUser()
  const { notify } = useToast()
  const [content, setContent] = useState<string|null|undefined>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const {createPost, invalidateFeed} = useFeed({type: 'post'})
  const [images, setImages] = useState<string[]>([])

  const onFilesComplete = async (files: CompleteFile[]) => {
    const setFiles = files.flatMap(f => f.secure_url)
    log(`\tCreatePost.onFilesComplete ${JSON.stringify(setFiles, null, 2)}`)
    setImages((current) => [...current, ...setFiles])
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) {
      return
    }

    const postData= {
      content: content!,
      authorId: cyfrUser.id,
      images: images.flatMap(url => url)
    }

    log(`CreatePost.tsx handleSubmit postData`, postData)
    const post = createPost(postData)

    if (!post) {
      notify({
        type: 'warning',
        message: `Uh. Ya that didn't work. Weird.`
      })
    } else {
      setContent(null)
      setImages(() => [])
      invalidateFeed()
    }

    onCreate()
  }

  useEffect(() => {
    const disabled =
      !cyfrUser || !content || content.length < 1
    setIsDisabled((current) => disabled)
  }, [content])

  return (
    <div
      className="mb-3 rounded-xl w-full 
      bg-primary text-primary-content 
      md:bg-blend-hard-light md:bg-opacity-80
      "
    >
      {cyfrUser &&
      <div className="w-full mx-auto p-2 sm:p-6 lg:p-4">
          <form className=" flex flex-col" onSubmit={handleSubmit}>
          <SimpleQuill content={content} setContent={setContent} />

          <Dropzone limit={5} onUploadComplete={onFilesComplete} />

          <div className="w-full grid place-items-end mt-2">
            <button
              disabled={isDisabled}
              className="btn lg:btn-sm p-2 
                bg-secondary text-primary-content
                disabled:bg-opacity-40
                disabled:text-primary
                "
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </form>
      </div>
      }
      {!cyfrUser && <LoggedIn />}
    </div>
)}
export default CreatePost
