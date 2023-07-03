import { TailwindSelectInput } from 'components/forms'
import useGenreApi from 'prisma/hooks/useGenreApi'
import { GenreStub } from 'prisma/prismaContext'
import React, { useEffect, useState } from 'react'
import { KeyVal } from 'types/props'

type GenreSelectorProps = {
    label?:         string
    showLabel?:     boolean
    genreTitle?:    string
    allowAll?:      boolean
    sendTitle?:     boolean
    onGenreSelect?: (value:string) => void
}

const GenreSelector = ({genreTitle, onGenreSelect, label='Genre', showLabel=true, allowAll=false, sendTitle=false}:GenreSelectorProps) => {
  const [genreList, setGenreList] = useState<KeyVal[]>([])

  const getGenres = async () => {
    const {stubs} = useGenreApi()
    const genres = await stubs()
    if (genres) {
      const sortMap = genres.sort((a,b) => a.title > b.title ? 1 : -1).map((g:GenreStub) => { return {value: g.id, key: g.title}})
      setGenreList(() => allowAll ? [{key: 'All', value: ''},...sortMap] : sortMap)
    }
  }

  const onGenreChange = (value:string) => {
    if (!onGenreSelect) return
    onGenreSelect(!sendTitle ? value : genreList.find(g => g.value === value)!.key )
  }

  useEffect(() => {
    getGenres()
  }, [])
  
  return (
    <div>
        {showLabel &&
        <label className="font-semibold w-[50%]">{label}</label>
        }
        <TailwindSelectInput
            value={genreTitle}
            setValue={onGenreChange}
            options={genreList}
        />
    </div>
  )
}

export default GenreSelector