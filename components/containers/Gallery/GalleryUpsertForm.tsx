import React, { useEffect, useState } from 'react'
import useDebug from '../../../hooks/useDebug'
import { Gallery, GalleryCreateProps, GalleryFeed, GalleryUpsertProps, Image } from '../../../prisma/prismaContext'
import { sendApi } from '../../../utils/api'
import { useCyfrUserContext } from '../../context/CyfrUserProvider'
import Dropzone, { CompleteFile } from '../../forms/Dropzone'
import TailwindInput from '../../forms/TailwindInput'
import GalleryPhotoswipe from './GalleryPhotoswipe'

const {debug} = useDebug('components/containers/Gallery/GalleryUpsertForm', 'DEBUG')

export type GalleryNestedProps = {
    gallery?:         GalleryFeed|Gallery|null
    limit?:           number|null
    label?:           string
    labelClassName?:  string
    className?:       string
    variant?:         'no-title'|'no-description'|null
}

//todo Add/Remove images to/from existing gallery
const GalleryUpsertForm = ({gallery, limit = 5, variant=null, className='', labelClassName='', label='Gallery'}:GalleryNestedProps) => {
    const [cyfrUser] = useCyfrUserContext()
    const [images, setImages] = useState<Image[]>([])
    const [files, setFiles] = useState<CompleteFile[]>([])
    const [title, setTitle] = useState<string|null>(null)
    const [description, setDescription] = useState<string|null>(null)
  
    const onFilesComplete = async (files: CompleteFile[]) => {
      debug(`onFilesComplete`,files)
      setFiles((current) => [...current, ...files])
    }
  
    const onFileRemove = async (file:any) => {
      debug(`onFileRemove`,{file, files})
      //todo: handle delete file from dropzone
    }

    const upsertGallery = async () => {
      const newGallery:GalleryUpsertProps = {
        ...gallery,
        title,
        description,
        authorId: cyfrUser.id,
        images: images,
        // files: files.map((img,idx) => {return {
        //   // @ts-ignore
        //   id: img.id || undefined,
        //   authorId: cyfrUser.id,
        //   // @ts-ignore
        //   url: img.url || img.secure_url,
        //   height: img.height,
        //   width: img.width,
        //   galleryId: gallery?.id||undefined
        // }})
      }
      const result = await sendApi('gallery/upsert', newGallery)
    }

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
        <Dropzone limit={limit!} onUploadComplete={onFilesComplete} onUploadRemove={onFileRemove} />
      </label>
    </div>
  )
}

export default GalleryUpsertForm