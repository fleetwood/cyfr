import useDebug from 'hooks/useDebug'
import { GalleryStub, GalleryUpsertProps, Image, ImageStub } from 'prisma/prismaContext'
import { useState } from 'react'
import { sendApi } from 'utils/api'

import { Dropzone, TailwindInput } from 'components/forms'
import GalleryPhotoswipe from './GalleryPhotoswipe'
import useApi from 'prisma/useApi'

const {debug} = useDebug('Gallery/GalleryUpsertForm')

export type GalleryNestedProps = {
    gallery?:         GalleryStub
    limit?:           number|null
    label?:           string
    labelClassName?:  string
    className?:       string
    variant?:         'no-title'|'no-description'|null
    onUpsert?:        (galleryId?:string) => void
}

const GalleryUpsertForm = ({gallery, onUpsert, limit = 5, variant=null, className='', labelClassName='', label='Gallery'}:GalleryNestedProps) => {
  const {cyfrUser, isLoading} = useApi.cyfrUser()
    const [images, setImages] = useState<ImageStub[]>(gallery?.images ?? [])
    const [title, setTitle] = useState<string|null>(gallery?.title ?? null)
    const [description, setDescription] = useState<string|null>(null)
  
    const onDropComplete = async (images: Image[]) => {
      debug(`onDropComplete`,images)
      setImages((current) => [...current, ...images as unknown as ImageStub[]])
    }
  
    const onDropChange = async (file:Image) => { 
      // const path = file.file.path
      debug(`onDropChange`,{file, images})
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
        creatorId: cyfrUser.id,
        images: images.map((img:ImageStub) => {return {
          id:     img.id,
          height: img.height,
          width:  img.width,
          url:    img.url,
          title:  img.title
        }as unknown as Image}),
        //TODO: add delete button
      }
      const saved = await sendApi('gallery/upsert', newGallery)
      if (onUpsert) {
        debug('onUpsert', {result: saved?.data?.result ?? null})
        onUpsert(saved?.data?.result ? saved.data.result.id : null)
      }
    }

    const isValid = () => images.filter(i => i.visible).length > 0

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
        <Dropzone limit={limit!} onDropComplete={onDropComplete} onDropChange={onDropChange} />
        <button className='btn btn-primary' disabled={!isValid()} onClick={upsertGallery}>Save</button>
      </label>
    </div>
  )
}

export default GalleryUpsertForm


