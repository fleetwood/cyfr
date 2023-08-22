import { useCyfrUserContext } from 'components/context/CyfrUserProvider'
import { useToast } from 'components/context/ToastContextProvider'
import Spinner from 'components/ui/spinner'
import useDebug from 'hooks/useDebug'
import { Cover, CoverStub, Genre, GenreStub, Image } from 'prisma/prismaContext'
import { FormEvent, useEffect, useRef, useState } from 'react'
import GalleryPhotoswipe from '../Gallery/GalleryImages'
import GenreSelector from '../Genre/GenreSelector'
import { ItemProps } from 'react-photoswipe-gallery'
import useApi from 'prisma/useApi'
import ModalCheckbox, { ModalCloseButton, ModalOpenButton } from 'components/ui/modalCheckbox'
import GalleryCovers from '../Gallery/GalleryCovers'
const {debug, info} = useDebug("Cover/FindCoverModal")

const findCoverModal = 'FindCoverModal'

export const OpenFindCoverModalButton = () => <ModalOpenButton id={findCoverModal} label='Find a Cover' />
export const OpenFindCoverModalPlus = () => <ModalOpenButton id={findCoverModal} />

/**
 * To select from pre-defined covers, NOT to create a cover
 */
type FindCoverModalType = {
  genre?: Genre|GenreStub
  setGenre?: (genre:Genre|GenreStub) => void
  selectCover?: (cover:Cover|CoverStub) => void
}

const FindCoverModal = ({genre, setGenre, selectCover}:FindCoverModalType) => {
  const {cyfrUser, isLoading, error} = useApi.cyfrUser()
  const {findCover} = useApi.cover()
  const { notify } = useToast()
  const container = useRef<HTMLDivElement>(null)

  const [byGenre, setByGenre] = useState(genre?.title)
  const [covers, setCovers] = useState<(CoverStub)[]>([])

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

  const onCoverSelect = (item:Image|Cover) => {
    debug('onCoverSelect', {item})
    
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
      setCovers(() => found)
    } else {
      info('No covers found')
    }
  }

  useEffect(() => {
    getCovers()
  }, ['',byGenre])

  return (
    <>
    <ModalCheckbox id={findCoverModal} />
    <div ref={container} id='FindCoverModalContainer' className="modal bg-opacity-20 modal-bottom sm:modal-middle">
      <div className="modal-box shadow-lg shadow-current scrollbar-hide">
        <ModalCloseButton id={findCoverModal} />
        <div className="mb-3 rounded-xl w-full bg-primary text-primary-content  md:bg-blend-hard-light md:bg-opacity-80 max-h-fit">
          {isLoading && <Spinner />}
          {cyfrUser && genre && (
            <div className="w-full mx-auto m-4 p-2 sm:p-6 lg:p-4 bg-base-300 rounded-lg">
              <GenreSelector genre={genre} setGenre={setGenre} />
              <GalleryCovers covers={covers} onSelect={onCoverSelect} />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default FindCoverModal