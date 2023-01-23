import { FormEvent, useEffect, useState } from "react"
import useCyfrUser from "../../../hooks/useCyfrUser"
import { sendApi } from "../../../utils/api"
import { log } from "../../../utils/log"
import { useToast } from "../../context/ToastContextProvider"
import TailwindTextarea from "../../forms/TailwindTextarea"
import { LoggedIn } from "../../ui/toasty"

type CreatePostProps = {
  onCreate: () => void
}

const CreatePost = ({ onCreate }: CreatePostProps): JSX.Element => {
  const { cyfrUser } = useCyfrUser()
  const { notify } = useToast()
  const [content, setContent] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) {
      return
    }

    const post = await sendApi("post/create", {
      content,
      authorid: cyfrUser!.id,
    })
    if (post) {
      setContent(null)
      onCreate()
    } else {
      log("Error creating post!")
    }
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
      {!cyfrUser && <div className="w-full mx-auto p-2 sm:p-6 lg:p-4"><div className="bg-base-200 p-4 rounded-md text-base-content"><LoggedIn /></div></div>}
    </div>
)}
export default CreatePost
