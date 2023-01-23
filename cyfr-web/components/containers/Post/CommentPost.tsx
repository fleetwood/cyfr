import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import useCyfrUser from "../../../hooks/useCyfrUser"
import { sendApi } from "../../../utils/api"
import { log, logError } from "../../../utils/log"
import TailwindInput from "../../forms/TailwindInput"
import TailwindTextarea from "../../forms/TailwindTextarea"
import usePostsApi from "../../../hooks/usePostsApi"

type CommentPostProps = {
  onComment: () => void
}

const CommentPost = ({ onComment }: CommentPostProps): JSX.Element => {
  const { cyfrUser } = useCyfrUser()
  const [content, setContent] = useState<string | null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)
  const {commentId } = usePostsApi()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) {
      return
    }

    const post = await sendApi("post/comment", {
      content,
      authorid: cyfrUser!.id,
      commentId
    })
    if (post) {
      setContent(null)
      onComment()
    } else {
      log("Error creating post!")
    }
  }

  useEffect(() => {
    const disabled = !cyfrUser || !content || content.length < 1
    // if (disabled) {
    //   log(`CommentPost.useEffect() isDisabled: ${isDisabled}, cyfrUser: ${cyfrUser !== null || cyfrUser !== undefined}, content: ${content}`)
    // }
    setIsDisabled((current) => disabled)
  }, [content])

  return (
    <div
      className="mb-3 rounded-xl w-full 
      bg-primary text-primary-content 
      md:bg-blend-hard-light md:bg-opacity-80
      "
    >
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
              Comment
            </button>
          </div>
        </form>
      </div>
    </div>
)}
export default CommentPost
