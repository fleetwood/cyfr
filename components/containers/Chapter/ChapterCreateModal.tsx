import { useCyfrUserContext } from 'components/context/CyfrUserProvider'
import { useToast } from 'components/context/ToastContextProvider'
import { TailwindInput } from 'components/forms'
import EZButton from 'components/ui/ezButton'
import Spinner from 'components/ui/spinner'
import { LoggedIn } from 'components/ui/toasty'
import useDebug from 'hooks/useDebug'
import { useBookApi } from 'prisma/hooks/useBookApi'
import { BookDetail, Chapter, ChapterListItem } from 'prisma/prismaContext'
import { FormEvent, useRef, useState } from 'react'

const {debug} = useDebug("components/containers/Chapter/CreateChapterModal", 'DEBUG')

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
  bookDetail:   BookDetail
  onSave?:      () => void
}

const CreateChapterModal = ({bookDetail, onSave}:CreateChapterModalType) => {
  const [cyfrUser, isLoading, error] = useCyfrUserContext()
  const { notify } = useToast()
  const {addChapter} = useBookApi

  const [valid, setIsValid] = useState<boolean>(false)
  const container = useRef<HTMLDivElement>(null)

  const nextOrder = (bookDetail?.chapters??[]).length+1
  const [chapterTitle, setChapterTitle] = useState<string | null>(null)
  const [chapterOrder, setChapterOrder] = useState<number>(nextOrder)

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!chapterTitle || chapterTitle.length<1) {
      debug(`handleSubmit: sth is disabled....`, { cyfrUser, chapterTitle })
      return
    }
    debug('handleSubmit', {book: bookDetail.id, chapterTitle, chapterOrder})
    const result = await addChapter(bookDetail.id, chapterTitle!, chapterOrder)
    if (result) {
      notify(`${chapterTitle} was added ${bookDetail?.title}!`)
      closeModal()
      if (onSave) onSave()
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
                  {(bookDetail?.chapters??[]).map((c:ChapterListItem,i:number) => (
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