import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import { FormEvent, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import SocialTextarea from "../../forms/SocialTextarea"
import { CyfrLogo, ReplyIcon } from "../../ui/icons"
import { LoggedIn } from "../../ui/toasty"

const {debug} = useDebug("components/containers/Post/CreateCommentModal")
const createCommentModal = 'createCommentModal'

const toggleModal = (show?:boolean) => {
  const createModal = document.getElementById(createCommentModal)
  // @ts-ignore
  createModal!.checked = show || false
}

export const CreateCommentModalButton = () => (
  <label htmlFor={createCommentModal} className="btn btn-info space-x-2">
    <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
    <span className="text-info-content">New Post</span>
  </label>
)

export const CreateCommentFooterButton = ({postId, comments}:{postId: string, comments: number}) => (
  <ShrinkableIconButton
      icon={ReplyIcon}
      className="bg-opacity-0 hover:shadow-none"
      iconClassName="text-primary"
      labelClassName="text-primary"
      label={comments.toString()}
      onClick={() => {toggleModal(true)}}
    />
)

const CreateCommentModal = (): JSX.Element => { 
  const {cyfrUser} = useCyfrUserContext()
  const { notify } = useToast()
  const [content, setContent] = useState<string | null>(null)
  const [valid, setIsValid] = useState<boolean>(false)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid) {
      debug(`handleSubmit: sth is disabled....`, { cyfrUser, content })
      return
    }

    const postData = {
      content: content!,
      creatorId: cyfrUser.id,
      postId: postMessage
    }

    notify('handleSubmit on CreateCommentModal Not Implemented', 'warning')

    const createModal = document.getElementById(createCommentModal)
    // @ts-ignore
    createModal!.checked = false
  }

  return (
    <>
    <input type="checkbox" id={createCommentModal} className="modal-toggle" />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-opacity-0 shadow-none overflow-visible scrollbar-hide">
        <label htmlFor={createCommentModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
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

                <div className="w-full grid place-items-end mt-2">
                  <button disabled={!valid} onClick={handleSubmit} className="
                    btn lg:btn-sm p-2 
                    bg-secondary text-primary-content
                    disabled:bg-warning disabled:bg-opacity-40 disabled:text-primary">
                    Comment
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
export default CreateCommentModal
