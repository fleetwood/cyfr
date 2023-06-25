import { Cover, CoverStub, GenreStub, Image } from 'prisma/prismaContext'
import React from 'react'
import BookCover from '../Books/BookCover'
import { cloudinary } from 'utils/cloudinary'
import { Dropzone } from 'components/forms'
import useGenreApi from 'prisma/hooks/useGenreApi'

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
        <Dropzone onDropComplete={addImage} limit={1} />
        {covers && covers.map((cover:CoverStub) => (
            <div className="book-cover">
            {cover && 
              <img src={cloudinary.thumb({ url: cover.image.url, width: cover.image.width! })} />
            }
            </div>
        ))}
        </label>
    </div>
  )
}

export default CoverGenreEdit