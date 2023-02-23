import React, { createContext, FormEvent, ReactNode, useContext, useEffect, useRef, useState } from "react"
import useCyfrUser from "../../hooks/useCyfrUser"
import { useToast } from "./ToastContextProvider"
import useFeed from "../../hooks/useFeed"

import useDebug from "../../hooks/useDebug"
const {debug} = useDebug({fileName: "InboxContextProvider"})

type InboxProviderProps = {
  children?: ReactNode
}

type InboxProviderType = {
  content: string|null
  setContent: Function
  partyId: string|null
  setPartyId: Function
  show: Function
  hide: Function
}

export const InboxContext = createContext({} as InboxProviderType)
export const useCommentContext = () => useContext(InboxContext)

const InboxProvider = ({ children }: InboxProviderProps) => {
  const [cyfrUser] = useCyfrUser()
  const {sendMessage, invalidateFeed} = useFeed({type: 'inbox'})
  const {notify} = useToast()
  
  const inboxUserModal = 'inboxUserModal'
  const modal = useRef<HTMLInputElement>(null)
  
  const [checked, setChecked] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [partyId, setPartyId] = useState<string|null>(null)
  const [isDisabled, setIsDisabled] = useState<boolean>(true)

  // @ts-ignore
  const show = () => setChecked(() => true)

  // @ts-ignore
  const hide = () => {
    setContent(null)
    setPartyId(null)
    setChecked(() => false)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isDisabled) {
      return
    }

    const thread = await sendMessage({
      partyId: partyId!,
      ownerId: cyfrUser.id,
      content: content!,
    })

    hide()

    if (thread) {
      debug(`handleSubmit success`)
      invalidateFeed()
    } else {
      notify({
        type: 'warning',
        message: `Hm. That didn't work....`
      })
    }
  }

  useEffect(() => {
    const disabled = !cyfrUser || !partyId || !content || content.length < 1
    setIsDisabled(() => disabled)
  }, [content])

  const value={content, setContent, partyId, setPartyId, show, hide}

  return (
    <InboxContext.Provider value={value}>
        <input type="checkbox" ref={modal} id={inboxUserModal} className="modal-toggle" checked={checked} onChange={()=>{}} />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-opacity-0 overflow-visible scrollbar-hide">
            
            <label onClick={hide} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>

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
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      {children}
    </InboxContext.Provider>
  )
}

export default InboxProvider
