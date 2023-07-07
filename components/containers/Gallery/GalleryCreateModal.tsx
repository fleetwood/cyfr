import { useCyfrUserApi } from "prisma/hooks/useCyfrUserApi"
import { useRef } from "react"
import useDebug from "hooks/useDebug"

import GalleryUpsertForm from "./GalleryUpsertForm"
import OpenModal from "components/ui/openModal"

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

  const {cyfrUser} = useCyfrUserApi()  

  return (
    <>
    <input type="checkbox" ref={modal} id={createGalleryModal} className="modal-toggle" onChange={()=>{}} />
    <div className="modal modal-bottom sm:modal-middle">
      <div className="modal-box bg-opacity-0 shadow-none">
      <label htmlFor={createGalleryModal} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <div className="mb-3 rounded-xl w-full bg-primary text-primary-content md:bg-blend-hard-light md:bg-opacity-80">
          {cyfrUser && (
            <div className="w-full mx-auto p-2 sm:p-6 lg:p-4 drop-shadow-xl">
              <form className="flex flex-col space-y-2 bg-secondary p-2 rounded-lg drop-shadow-lg border border-base-100 border-opacity-50" onSubmit={(e) => {e.preventDefault()}}>
                <GalleryUpsertForm limit={limit} onUpsert={onGalleryUpsert} />
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default GalleryCreateModal

