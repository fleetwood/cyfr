import React, { useEffect, useState } from 'react'
import useDebug from '../../../hooks/useDebug'
import { Gallery } from '../../../prisma/prismaContext'
import Dropzone, { CompleteFile } from '../../forms/Dropzone'
import TailwindInput from '../../forms/TailwindInput'
import GalleryPhotoswipe from './GalleryPhotoswipe'

const {debug} = useDebug('GalleryNestedUpsert', 'DEBUG')

export type GalleryNestedProps = {
    gallery?:         Gallery|null
    label?:           string
    labelClassName?:  string
    className?:       string
    variant?:         'no-title'|'no-description'|null
}

const GalleryUpsertForm = ({gallery, variant=null, className='', labelClassName='', label='Gallery'}:GalleryNestedProps) => {
    const [images, setImages] = useState<string[]>([])
    const [title, setTitle] = useState<string|null>(null)
    const [description, setDescription] = useState<string|null>(null)
  
    const onFilesComplete = async (files: CompleteFile[]) => {
      const setFiles = files.flatMap((f) => f.secure_url)
      debug(`onFilesComplete`,setFiles)
      setImages((current) => [...current, ...setFiles])
    }

    useEffect(() => {}, [
      // gallery && gallery.images !== null
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
        <Dropzone limit={5} onUploadComplete={onFilesComplete} />
      </label>
    </div>
  )
}

export default GalleryUpsertForm