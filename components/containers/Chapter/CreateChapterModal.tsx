import React, { FormEvent, useRef, useState } from 'react'
import useDebug from '../../../hooks/useDebug'
import { useCyfrUserContext } from '../../context/CyfrUserProvider'
import { useToast } from '../../context/ToastContextProvider'
import { LoggedIn } from '../../ui/toasty'
import Spinner from '../../ui/spinner'
import { TailwindInput } from '../../forms'
import EZButton from '../../ui/ezButton'
import { BookApi, Chapter } from '../../../prisma/prismaContext'
const {debug} = useDebug("components/containers/Chapter/CreateChapterModal")

const createChapterModal = 'createChapterModal'


type ChapterModalButtonVariant = {
  variant?: 'button'|'plus'
}
export const OpenChapterModalButton = ({variant='button'}:ChapterModalButtonVariant) => (
  variant === 'button' 
  ?
    <label htmlFor={createChapterModal} className="btn btn-info space-x-2">
      <span className="text-info-content">New Chapter</span>
    </label>
  :
    <label htmlFor={createChapterModal} className="btn btn-sm btn-info btn-circle">+</label>
)

type CreateChapterModalType = {
  forBook: BookApi
}

const CreateChapterModal = ({forBook}:CreateChapterModalType) => {
  const [cyfrUser, isLoading, error] = useCyfrUserContext()
  const {bookDetail, addChapter} = forBook
  const { notify } = useToast()
  const [valid, setIsValid] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  const nextOrder = forBook.chapters.length+1
  const [chapterTitle, setChapterTitle] = useState<string | null>(null)
  const [chapterOrder, setChapterOrder] = useState<number>(nextOrder)

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!chapterTitle || chapterTitle.length<1) {
      debug(`handleSubmit: sth is disabled....`, { cyfrUser, chapterTitle })
      return
    }
    const result = await addChapter(chapterTitle!, chapterOrder)
    if (result) {
      notify(`${chapterTitle} was added ${bookDetail?.title}!`)
      closeModal()
    } else {
      notify('Hm, that dint work', 'warning')
    }
  }

  const buttonGotThis = (e: { preventDefault: () => void }) => {
    e.preventDefault()
  }

  const closeModal = (e?:any) => {
    debug('closeModal')
    const createModal = document.getElementById(createChapterModal)
    // @ts-ignore
    createModal!.checked = false
  }

  return (
    <>
    <input type="checkbox" id={createChapterModal} className="modal-toggle" />
    <div ref={container} id='createChapterModalContainer' className="modal bg-opacity-0 modal-bottom sm:modal-middle">
      <div className="modal-box shadow-none overflow-visible scrollbar-hide">
        <label htmlFor={createChapterModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div className="mb-3 rounded-xl w-full bg-primary text-primary-content  md:bg-blend-hard-light md:bg-opacity-80">
          {isLoading && <Spinner />}
          {!isLoading && !cyfrUser &&
            <LoggedIn />
          }
          {cyfrUser && (
            <div className="w-full mx-auto m-4 p-2 sm:p-6 lg:p-4 bg-base-300 rounded-lg">
              <form className=" flex flex-col" onSubmit={buttonGotThis}>
                <TailwindInput type='text' label='Title' value={chapterTitle} setValue={setChapterTitle} required={true} />
                <label className='block'>
                  <span className='text-primary font-bold'>Order</span>
                </label>
                <div className='flex'>
                  {forBook.chapters.map((c:Chapter,i:number) => (
                  <div className={`btn btn-sm btn-circle ${i+1===chapterOrder ? 'btn-primary' :''}`} onClick={() => setChapterOrder(i+1)} key={c.id}>{i+1}</div>
                  ))}
                  <div className={`btn btn-sm btn-circle ${chapterOrder === nextOrder ? 'btn-primary' :''}}`} onClick={() => setChapterOrder(nextOrder)}>{nextOrder}</div>
                </div>
                <div className="w-full grid place-items-end mt-2">
                  <EZButton disabled={chapterTitle===null || chapterTitle.trim().length<1} label='Create' onClick={handleSubmit} />
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