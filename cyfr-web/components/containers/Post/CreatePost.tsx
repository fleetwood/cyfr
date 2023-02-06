import { FormEvent, useEffect, useState } from "react"
import useCyfrUser, { useCyfrUserProps } from "../../../hooks/useCyfrUser"
import { sendApi } from "../../../utils/api"
import { log } from "../../../utils/log"
import { useToast } from "../../context/ToastContextProvider"
import TailwindTextarea from "../../forms/TailwindTextarea"
import { LoggedIn } from "../../ui/toasty"
import useFeed from "../../../hooks/useFeed"

type CreatePostProps = {
  onCreate: () => void
}

const CreatePost = ({ onCreate }: CreatePostProps): JSX.Element => {
  const [cyfrUser] = useCyfrUser()
  const { notify } = useToast()
  const [content, setContent] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const {createPost, invalidateFeed} = useFeed('post')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) {
      return
    }
    const post = createPost({
      content: content!,
      authorId: cyfrUser.id
    })

    if (!post) {
      notify({
        type: 'warning',
        message: `Uh. Ya that didn't work. Weird.`
      })
      setContent(null)
    } else {
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
          <TailwindTextarea
            label="What do you want to say?"
            value={content}
            setValue={setContent}
            inputClassName="text-base-content"
          />

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
