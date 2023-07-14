import { useCyfrUserContext } from 'components/context/CyfrUserProvider'
import { useToast } from 'components/context/ToastContextProvider'
import OpenModal from 'components/ui/openModal'
import Spinner from 'components/ui/spinner'
import useDebug from 'hooks/useDebug'
import { Genre, Image } from 'prisma/prismaContext'
import { FormEvent, useEffect, useRef, useState } from 'react'
import GalleryPhotoswipe from '../Gallery/GalleryPhotoswipe'
import GenreSelector from '../Genre/GenreSelector'
import { ItemProps } from 'react-photoswipe-gallery'
import useApi from 'prisma/useApi'
const {debug, info} = useDebug("Cover/FindCoverModal")

const findCoverModal = 'FindCoverModal'

export const OpenFindCoverModalButton = () => <OpenModal htmlFor={findCoverModal} label='Find a Cover' />
export const OpenFindCoverModalPlus = () => <OpenModal htmlFor={findCoverModal} variant='plus' />

type FindCoverModalType = {
  genre?: Genre
  onSelect?: (item:ItemProps) => void
}

const FindCoverModal = ({genre, onSelect}:FindCoverModalType) => {
  const {cyfrUser, isLoading, error} = useApi.cyfrUser()
  const {findCover} = useApi.cover()
  const { notify } = useToast()
  const container = useRef<HTMLDivElement>(null)

  const [byGenre, setByGenre] = useState(genre?.title)
  const [covers, setCovers] = useState<Image[]>([])

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

  const onCoverSelect = (item:any) => {
    debug('onCoverSelect', {item})
    if (onSelect) onSelect(item)
    closeModal()
  }

  const onGenreSelect = (value: string) => {
    notify(value ? `Genre selected ${value}` : 'All genres selected')
    setByGenre(() => value)
  }

  const getCovers = async () => {
    debug('getCovers', {byGenre})
    const found = await findCover(byGenre === 'All' ? '' : byGenre)
    if (found) {
      setCovers(() => found.map(c => c.image))
    } else {
      info('No covers found')
    }
  }

  useEffect(() => {
    getCovers()
  }, ['',byGenre])

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
              <GenreSelector genreTitle={genre.title} allowAll={true} onGenreSelect={onGenreSelect} sendTitle={true} />
              <GalleryPhotoswipe images={covers} onClick={onCoverSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default FindCoverModal