import { Dropzone } from 'components/forms'
import useDebug from 'hooks/useDebug'
import { CoverStub, GenreStub, Image } from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import { useState } from 'react'
import { cloudinary } from 'utils/cloudinary'
import { uniqueKey } from 'utils/helpers'

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
  const {addCover} = useApi.genre()
  const [covers, setCovers] = useState<CoverStub[]>()

  const addImage = async (files:Image[]) => {
    const cover = await addCover({id: genre!.id, image:files[0]})
    if (cover && onUpdate) onUpdate()
  }

  return (
    <div>
        <label className={`block ${cardClassName||''}`}>
        {label &&
          <span className={labelClassName??''+' text-primary font-bold'}>{label}</span>
        }
        <div className="flex space-x-4 my-2">
        {covers && covers.map((cover:any, i:number) => (
          <img src={cloudinary.thumb({ url: cover.image.url, width: 40 })} key={uniqueKey(genre,cover)} />
        ))}
        </div>
        </label>
        <Dropzone onDropComplete={addImage} limit={1} />
    </div>
  )
}

export default CoverGenreEdit