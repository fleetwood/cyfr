import { useRef } from "react"
import useDebug from "hooks/useDebug"

import GalleryUpsertForm from "./GalleryUpsertForm"
import OpenModal from "components/ui/openModal"
import useApi from "prisma/useApi"

const {debug} = useDebug('components/containers/GalleryGalleryCreateView')

const createGalleryModal = "createGalleryModal"

export const OpenGalleryModalButton = () => <OpenModal htmlFor={createGalleryModal} label='Create Gallery' />
export const OpenGalleryModalPlus = () => <OpenModal htmlFor={createGalleryModal} variant='plus' />

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
    debug('closeModal')
    const galleryModal = document.getElementById(createGalleryModal)
    // @ts-ignore
    galleryModal!.checked = false
  }

  const onGalleryUpsert = (galleryId?:string) => {
    debug('onGalleryUpsert', galleryId||'')
    closeModal()
    if (onUpsert) onUpsert()
  }

  const {cyfrUser} = useApi.cyfrUser()

  return (
    <>
    <input type="checkbox" ref={modal} id={createGalleryModal} className="modal-toggle" onChange={()=>{}} />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-opacity-0 shadow-none">
        {cyfrUser && (
          <div className="w-full mx-auto drop-shadow-xl">
            <form className="bg-base-100 p-2 rounded-lg drop-shadow-lg" onSubmit={(e) => {e.preventDefault()}}>
              <GalleryUpsertForm limit={limit} onUpsert={onGalleryUpsert} className="flex flex-col space-y-2" />
            </form>
          </div>
        )}
        <label htmlFor={createGalleryModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
      </div>
    </div>
    </>
  )
}

export default GalleryCreateModal

