import React, { FormEvent, useState } from 'react'
import useDebug from '../../../hooks/useDebug'
import { useCyfrUserContext } from '../../context/CyfrUserProvider'
import { useToast } from '../../context/ToastContextProvider'
import { LoggedIn } from '../../ui/toasty'
import Spinner from '../../ui/spinner'
import { TailwindInput } from '../../forms'
const {debug} = useDebug("components/containers/Chapter/CreateChapterModal")

const createChapterModal = 'createChapterModal'

export const OpenChapterModalButton = () => (
<label htmlFor={createChapterModal} className="btn btn-info space-x-2">
  <span className="text-info-content">New Chapter</span>
</label>
)

const CreateChapterModal = () => {
  const [cyfrUser, isLoading, error] = useCyfrUserContext()
  const { notify } = useToast()
  const [chapterTitle, setChapterTitle] = useState<string | null>(null)
  const [valid, setIsValid] = useState<boolean>(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!valid) {
      debug(`handleSubmit: sth is disabled....`, { cyfrUser, chapterTitle })
      return
    }

    const createModal = document.getElementById(createChapterModal)
    // @ts-ignore
    createModal!.checked = false
  }

  return (
    <>
    <input type="checkbox" id={createChapterModal} className="modal-toggle" />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-opacity-0 shadow-none overflow-visible scrollbar-hide">
        <label htmlFor={createChapterModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div
          className="mb-3 rounded-xl w-full 
          bg-primary text-primary-content 
          md:bg-blend-hard-light md:bg-opacity-80
          "
        >
        {isLoading && <Spinner />}
        {!isLoading && !cyfrUser &&
            <LoggedIn />
        }
          {cyfrUser && (
            <div className="w-full mx-auto p-2 sm:p-6 lg:p-4 bg-base-200 rounded-lg">
              <form className=" flex flex-col" onSubmit={handleSubmit}>
                <TailwindInput type='text' label='Title' value={chapterTitle} setValue={setChapterTitle} required={true} />

                <div className="w-full grid place-items-end mt-2">
                  <button
                    disabled={!valid}
                    onClick={handleSubmit}
                    className="
                      btn lg:btn-sm p-2 bg-secondary text-primary-content
                      disabled:bg-warning disabled:bg-opacity-40 disabled:text-primary
                    "
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default CreateChapterModal