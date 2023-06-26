import { useCyfrUserContext } from 'components/context/CyfrUserProvider'
import { useToast } from 'components/context/ToastContextProvider'
import { TailwindSelectInput } from 'components/forms'
import OpenModal from 'components/ui/openModal'
import Spinner from 'components/ui/spinner'
import useDebug from 'hooks/useDebug'
import { BookDetail, Genre } from 'prisma/prismaContext'
import { FormEvent, useRef } from 'react'
import GenreSelector from '../Genre/GenreSelector'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'
const {debug} = useDebug("components/containers/Character/FindCoverModal")

const findCoverModal = 'FindCoverModal'

export const OpenFindCoverModalButton = () => <OpenModal htmlFor={findCoverModal} label='Find a Cover' />
export const OpenFindCoverModalPlus = () => <OpenModal htmlFor={findCoverModal} variant='plus' />

type FindCoverModalType = {
  genre?: Genre
}

const FindCoverModal = ({genre}:FindCoverModalType) => {
  const [cyfrUser, isLoading, error] = useCyfrUserContext()
  const { notify } = useToast()
  const container = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault()
    
    notify('No Implemented', 'warning')
    closeModal()
  }

  const closeModal = (e?:any) => {
    debug('closeModal')
    const createModal = document.getElementById(findCoverModal)
    // @ts-ignore
    createModal!.checked = false
  }

  return (
    <>
    <input type="checkbox" id={findCoverModal} className="modal-toggle" />
    <div ref={container} id='FindCoverModalContainer' className="modal bg-opacity-20 modal-bottom sm:modal-middle">
      <div className="modal-box shadow-lg shadow-current scrollbar-hide">
        <label htmlFor={findCoverModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div className="mb-3 rounded-xl w-full bg-primary text-primary-content  md:bg-blend-hard-light md:bg-opacity-80 max-h-fit">
          {isLoading && <Spinner />}
          {cyfrUser && genre && (
            <div className="w-full mx-auto m-4 p-2 sm:p-6 lg:p-4 bg-base-300 rounded-lg">
              <GenreSelector genreTitle={genre.title} allowAll={true} />
              <GalleryPhotoswipe images={[]} />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default FindCoverModal