import React, { createContext, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from "react"
import useCyfrUser from "../../hooks/useCyfrUser"
import TailwindTextarea from "../forms/TailwindTextarea"
import { log } from "../../utils/log"
import usePosts from "../../hooks/usePosts"
import { useToast } from "./ToastContextProvider"

type CommentProviderProps = {
  children?: ReactNode
}

type CommentProviderType = {
  commentId: string|null
  setCommentId: Function
  showComment: Function
  hideComment: Function
}

export const CommentContext = createContext({} as CommentProviderType)
export const useCommentContext = () => useContext(CommentContext)

const CommentProvider = ({ children }: CommentProviderProps) => {
  const [cyfrUser] = useCyfrUser()
  const {comment, invalidatePosts} = usePosts()
  const {notify} = useToast()
  
  const commentPostModal = 'commentPostModal'
  const modal = useRef<HTMLInputElement>(null)
  
  const [checked, setChecked] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [commentId, setCommentId] = useState<string|null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  // @ts-ignore
  const showComment = () => setChecked(() => true)

  // @ts-ignore
  const hideComment = () => {
    setContent(null)
    setCommentId(null)
    setChecked(() => false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) {
      return
    }

    const post = await comment({
      content: content!,
      authorId: cyfrUser.id,
      commentId: commentId!,
    })

    hideComment()

    if (post) {
      log(`CommentContextProvider.handleSubmit success`)
      invalidatePosts()
    } else {
      notify({
        type: 'warning',
        message: `Hm. That didn't work....`
      })
    }
  }

  useEffect(() => {
    const disabled = !cyfrUser || !commentId || !content || content.length < 1
    setIsDisabled(() => disabled)
  }, [content])

  const value={commentId, setCommentId, showComment, hideComment}

  return (
    <CommentContext.Provider value={value}>
        <input type="checkbox" ref={modal} id={commentPostModal} className="modal-toggle" checked={checked} onChange={()=>{}} />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-opacity-0 shadow-none">
            
            <label onClick={hideComment} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

            <div className="
              mb-3 rounded-xl w-full 
              bg-primary text-primary-content 
              md:bg-blend-hard-light md:bg-opacity-80
              "
            >
              <div className="w-full mx-auto p-2 sm:p-6 lg:p-4 bg-content">
                <form className=" flex flex-col" onSubmit={handleSubmit}>
                  <TailwindTextarea
                    label={`Commenting as ${cyfrUser?.name||''} (${commentId})`}
                    value={content}
                    setValue={setContent}
                    inputClassName="text-base-content"
                  />

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
