import React, { useEffect, useState } from 'react'
import useDebug from '../../../hooks/useDebug'
import { Gallery, GalleryCreateProps, GalleryStub, GalleryUpsertProps, Image } from '../../../prisma/prismaContext'
import { sendApi } from '../../../utils/api'
import { useCyfrUserContext } from '../../context/CyfrUserProvider'
import Dropzone, { CompleteFile } from '../../forms/Dropzone'
import TailwindInput from '../../forms/TailwindInput'
import GalleryPhotoswipe from './GalleryPhotoswipe'

const {debug} = useDebug('components/containers/Gallery/GalleryUpsertForm')

export type GalleryNestedProps = {
    gallery?:         GalleryStub
    limit?:           number|null
    label?:           string
    labelClassName?:  string
    className?:       string
    variant?:         'no-title'|'no-description'|null
    onUpsert?:        Function
}

//TODO Add/Remove images to/from existing gallery
const GalleryUpsertForm = ({gallery, onUpsert, limit = 5, variant=null, className='', labelClassName='', label='Gallery'}:GalleryNestedProps) => {
    const [cyfrUser] = useCyfrUserContext()
    const [images, setImages] = useState<Image[]>(gallery?.images ?? [])
    const [title, setTitle] = useState<string|null>(gallery?.title ?? null)
    const [description, setDescription] = useState<string|null>(null)
  
    const onFilesComplete = async (images: Image[]) => {
      debug(`onFilesComplete`,images)
      setImages((current) => [...current, ...images])
    }
  
    const onFileChange = async (file:Image) => { 
      // const path = file.file.path
      debug(`onFileRemove`,{file, images})
      const fileChange = images.map(f => {
        return {
          ...f,
          visible: file.id === f.id ? file.visible : f.visible
        }})
      setImages(c => [...fileChange])
    }

    const upsertGallery = async () => {
      const newGallery:GalleryUpsertProps = {
        ...gallery,
        title,
        description,
        authorId: cyfrUser.id,
        images: images,
        //TODO: add delete button
      }
      const result = await sendApi('gallery/upsert', newGallery)
      if (result?.data) {
        const upsertGallery = result.data
        debug('upsertGallery', {upsertGallery})
        if (onUpsert) onUpsert(result.data)
      }
    }

    const isValid = () => images.filter(i => i.visible).length > 0

    useEffect(() => {
      if (gallery && Object.hasOwn(gallery,'images')) {
        // @ts-ignore
        const images = gallery.images || []
      }
    }, [
    ])
  return (
    <div className={className}>
      <label className={`block`}>
        {label &&
          <span className={'font-bold text-lg '+labelClassName}>{label}</span>
        }
        {variant!=='no-title' &&
        <TailwindInput type='text' label='Title' value={title} setValue={setTitle} />
        }
        {variant!=='no-title' && variant!=='no-description' &&
        <TailwindInput type='text' label='Description' value={description} setValue={setDescription} />
        }
        <GalleryPhotoswipe gallery={gallery} />
        <Dropzone limit={limit!} onDropComplete={onFilesComplete} onDropChange={onFileChange} />
        <button className='btn btn-primary' disabled={!isValid()} onClick={upsertGallery}>Save</button>
      </label>
    </div>
  )
}

export default GalleryUpsertForm