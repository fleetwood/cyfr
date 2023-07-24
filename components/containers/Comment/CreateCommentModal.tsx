import ShrinkableIconButton from "components/ui/shrinkableIconButton"
import { FormEvent, useState } from "react"
import useDebug from "../../../hooks/useDebug"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import { useToast } from "../../context/ToastContextProvider"
import SocialTextarea from "../../forms/SocialTextarea"
import { CyfrLogo, ReplyIcon } from "../../ui/icons"
import { LoggedIn } from "../../ui/toasty"
import ModalCheckbox, { ModalCloseButton, ModalOpenButton } from "components/ui/modalCheckbox"

const {debug} = useDebug("components/containers/Post/CreateCommentModal")
const createCommentModal = 'createCommentModal'

export const CreateCommentModalButton = () => (
  <ModalOpenButton id={createCommentModal} className="btn btn-info space-x-2">
    <CyfrLogo className="animate-pulse text-info-content w-[1.25rem]" />
    <span className="text-info-content">New Post</span>
  </ModalOpenButton>
)

export const CreateCommentFooterButton = ({postId, comments}:{postId: string, comments: number}) => (
  <ShrinkableIconButton
      icon={ReplyIcon}
      className="bg-opacity-0 hover:shadow-none"
      iconClassName="text-primary"
      labelClassName="text-primary"
      label={comments.toString()}
      onClick={() => {
        debug('CreateCommentFooterButton needs manual modal toggle')
        // toggleModal(true)
      }}
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

  }

  return (
    <>
    <ModalCheckbox id={createCommentModal} />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-opacity-0 shadow-none overflow-visible scrollbar-hide">
        <ModalCloseButton id={createCommentModal} />
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
