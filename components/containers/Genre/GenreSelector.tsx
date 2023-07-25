import { TailwindSelectInput } from 'components/forms'
import useDebug from 'hooks/useDebug'
import { Genre, GenreStub } from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, { Key, useEffect, useState } from 'react'
import { KeyVal } from 'types/props'

const {debug} = useDebug('containers/Genre/GenreSelector', 'DEBUG')

    /**
    * @param setGenre Provides a {@link KeyVal} of `genre.id` and `genre.title`. **Do not set this to a `useState<Genre>` parameter**, point it to a handler instead.
    */
type GenreSelectorProps = {
    label?:         string
    showLabel?:     boolean
    className?:     string
    allowAll?:      boolean
    required?:      boolean
    sendTitle?:     boolean
    genre?:         GenreStub|Genre
    genreId?:       string
    setGenre?:      (genre:KeyVal|string) => void
}

/**
 * 
 * @param label Sets the label for the input, not the value of the input
 * @param genre Will accept {@link GenreStub}|{@link Genre} as an initial value. This will be mapped to a {@link KeyVal} of `{key: id, value: title}`
 * @param genreId Will accept {string} `genre.id` as an initial value. This will be compared to {@link useApi.genre()}{@link useApi.genre().stubs()} to find the matching {@link GenreStub} and its covers.
 * @param sendTitle If this flag is set, {@link setGenre} will try to send the `kv.value` (?? `kv.key`) instead of {@link KeyVal}
 * @returns 
 */
const GenreSelector = ({
  genre, 
  genreId, 
  setGenre, 
  label='Genre', 
  showLabel=true, 
  allowAll=false, 
  sendTitle=false, 
  className='', 
  required=false
}:GenreSelectorProps) => {

  const [genreList, setGenreList] = useState<KeyVal[]>([])

  const getGenres = async () => {
    const {stubs} = useApi.genre()
    const genres = await stubs()
    if (genres) {
      const sortMap = genres.sort((a,b) => a.title > b.title ? 1 : -1).map((g:GenreStub) => { return {value: g.id, key: g.title} as KeyVal})
      setGenreList(() => allowAll ? [{key: 'All', value: ''},...sortMap] : sortMap)
    }
  }

  const onChange = (kv:KeyVal) => {
    debug('onChange')
    if (!setGenre) return
    setGenre(sendTitle ? (kv.value ?? kv.key).toString() : kv)
  }

  useEffect(() => {
    getGenres()
  }, [])
  
  return (
    <div className={className}>
        {showLabel &&
          <label className="font-semibold w-[50%]">{label}{required && <>*</>}</label>
        }
        <TailwindSelectInput
            value={(genre?.id??genreId)!}
            onChange={() => onChange}
            options={genreList}
        />
    </div>
  )
}

export default GenreSelector