import { createContext, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from "react"
import useFeed from "../../hooks/useFeed"
import { useToast } from "./ToastContextProvider"

import useDebug from "../../hooks/useDebug"
import usePostApi from "../../prisma/useApi/post"
import useApi from "prisma/useApi"
import ModalCheckbox, { ModalCloseButton } from "components/ui/modalCheckbox"
const {debug} = useDebug("CommentContextProvider")

type CommentProviderProps = {
  children?: ReactNode
}

type CommentProviderType = {
  postId: string|null
  setPostId: Function
  showComment: Function
  hideComment: Function
}

export const CommentContext = createContext({} as CommentProviderType)
export const useCommentContext = () => useContext(CommentContext)

const CommentProvider = ({ children }: CommentProviderProps) => {
  const {cyfrUser} = useApi.cyfrUser()
  
  const {notify, notifyNotImplemented} = useToast()
  
  const commentPostModal = 'commentPostModal'
  
  const [checked, setChecked] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [postId, setPostId] = useState<string|null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  // @ts-ignore
  const showComment = () => setChecked(() => true)

  // @ts-ignore
  const hideComment = () => {
    setContent(null)
    setPostId(null)
    setChecked(() => false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) {
      return
    }

    notifyNotImplemented()
    // const post = await commentOnPost({
    //   content: content!,
    //   creatorId: cyfrUser.id,
    //   postId: postId!,
    // })

    // hideComment()

    // if (post) {
    //   debug(`handleSubmit success`)
    //   invalidate()
    // } else {
    //   notify(`Hm. That didn't work....`,'warning')
    // }
  }

  useEffect(() => {
    const disabled = !cyfrUser || !postId || !content || content.length < 1
    setIsDisabled(() => disabled)
  }, [content])

  const value={postId, setPostId, showComment, hideComment}

  return (
    <CommentContext.Provider value={value}>
        <ModalCheckbox id={commentPostModal} />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-opacity-0 overflow-visible scrollbar-hide">
            
            <ModalCloseButton id={commentPostModal} />

            <div className="
              mb-3 rounded-xl w-full 
              bg-primary text-primary-content 
              md:bg-blend-hard-light md:bg-opacity-80
              "
            >
              <div className="w-full mx-auto p-2 sm:p-6 lg:p-4 bg-content">
                <form className=" flex flex-col" onSubmit={handleSubmit}>

                  <div className="w-full grid place-items-end mt-2">
                    <button
                      disabled={isDisabled}
                      className="btn lg:btn-sm p-2 bg-secondary text-primary-content disabled:bg-opacity-40 disabled:text-primary"
                      onClick={handleSubmit}
                      >
                      Comment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      {children}
    </CommentContext.Provider>
  )
}

export default CommentProvider
