import { Dispatch, FormEvent, ReactNode, SetStateAction, useEffect, useRef, useState } from "react"
import useFeed from "../../../hooks/useFeed"
import { useToast } from "../../context/ToastContextProvider"

import useDebug from "../../../hooks/useDebug"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
const {debug} = useDebug("components/containers/Comment/InboxContextProvider")

type InboxProviderProps = {
  children?: ReactNode
  checked: boolean
  setChecked: Dispatch<SetStateAction<boolean>>
}

const SendMessageModal = ({checked, setChecked, children }: InboxProviderProps) => {
  const {cyfrUser} = useCyfrUserContext()
  const {invalidate} = useFeed('inbox')
  const {notify} = useToast()
  
  const inboxUserModal = 'inboxUserModal'
  const modal = useRef<HTMLInputElement>(null)
  
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

    notify('not implemented')
    return 

    // const thread = await sendMessage({
    //   partyId: partyId!,
    //   userId: cyfrUser.id,
    //   messages: [{creatorId: cyfrUser.id, content: content!}]
    // })

    // hide()

    // if (thread) {
    //   debug(`handleSubmit success`)
    //   invalidate()
    // } else {
    //   notify(`Hm. That didn't work....`,'warning')
    // }
  }

  useEffect(() => {
    const disabled = !cyfrUser || !partyId || !content || content.length < 1
    setIsDisabled(() => disabled)
  }, [content])

  return (
    <div>
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
    </div>
  )
}

export default SendMessageModal
