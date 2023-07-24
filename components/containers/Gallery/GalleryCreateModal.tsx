import { useRef } from "react"
import useDebug from "hooks/useDebug"

import GalleryUpsertForm from "./GalleryUpsertForm"
import useApi from "prisma/useApi"
import ModalCheckbox, { ModalCloseButton, ModalOpenButton } from "components/ui/modalCheckbox"

const {debug} = useDebug('components/containers/GalleryGalleryCreateView')

const createGalleryModal = "createGalleryModal"

export const OpenGalleryModalButton = () => <ModalOpenButton id={createGalleryModal} label='Create Gallery' />
export const OpenGalleryModalPlus = () => <ModalOpenButton id={createGalleryModal} variant='plus' />

type GalleryCreateModalProps = {
  onUpsert?:  (galleryId?:string) => void
  limit?:      number
} 

/**
 *
 * @param {{ limit?: number; }} {limit=-1}
 */
const GalleryCreateModal = ({onUpsert, limit=-1, }:GalleryCreateModalProps) => {
  const modal = useRef<HTMLInputElement>(null)

  const closeModal = (e?:any) => {
    debug('closeModal TODO: create a manual close for modal')
  }

  const onGalleryUpsert = (galleryId?:string) => {
    debug('onGalleryUpsert', galleryId||'')
    closeModal()
    if (onUpsert) onUpsert()
  }

  const {cyfrUser} = useApi.cyfrUser()

  return (
    <>
    <ModalCheckbox id={createGalleryModal} />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-opacity-0 shadow-none">
        {cyfrUser && (
          <div className="w-full mx-auto drop-shadow-xl">
            <form className="bg-base-100 p-2 rounded-lg drop-shadow-lg" onSubmit={(e) => {e.preventDefault()}}>
              <GalleryUpsertForm limit={limit} onUpsert={onGalleryUpsert} className="flex flex-col space-y-2" />
            </form>
          </div>
        )}
        <ModalCloseButton id={createGalleryModal} />Z
      </div>
    </div>
    </>
  )
}

export default GalleryCreateModal

