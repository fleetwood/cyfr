import { Cover, CoverStub, GenreStub, Image } from 'prisma/prismaContext'
import React from 'react'
import BookCover from '../Books/BookCover'
import { cloudinary } from 'utils/cloudinary'
import { Dropzone } from 'components/forms'
import useGenreApi from 'prisma/hooks/useGenreApi'
import useDebug from 'hooks/useDebug'
import { uniqueKey, uuid } from 'utils/helpers'

const {debug} = useDebug('containers/Cover/CoverGenreEdit', 'DEBUG')

type CoverGenreEditType = {
    label?:             string | ''
    placeholder?:       string | ''
    cardClassName?:     string | ''
    labelClassName?:    string | ''
    inputClassName?:    string | ''
    genre:              GenreStub
    onUpdate?:          () => void
}

const CoverGenreEdit = ({genre, cardClassName, labelClassName, label, onUpdate}:CoverGenreEditType) => {
  const {addCover} = useGenreApi()
  const {covers} = genre

  const addImage = async (files:Image[]) => {
    const cover = await addCover({id: genre!.id, image:files[0]})
    if (cover) {
      if (onUpdate) onUpdate()
    }
  }

  return (
    <div>
        <label className={`block ${cardClassName||''}`}>
        {label &&
            <span className={labelClassName??''+' text-primary font-bold'}>{label}</span>
        }
        <div className="flex space-x-4 my-2">
        {covers && covers.map((cover:any, i) => (
          <img src={cloudinary.thumb({ url: cover.image.url, width: 40 })} key={uniqueKey(genre,cover)} />
        ))}
        </div>
        </label>
        <Dropzone onDropComplete={addImage} limit={1} />
    </div>
  )
}

export default CoverGenreEdit