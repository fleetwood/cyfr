import { Menu, MenuItem } from '@mui/material'
import { TailwindSelectInput } from 'components/forms'
import TailwindLabel from 'components/forms/TailwindLabel'
import useDebug from 'hooks/useDebug'
import { Genre, GenreStub } from 'prisma/prismaContext'
import useApi from 'prisma/useApi'
import React, { Key, useEffect, useState } from 'react'
import { KeyVal } from 'types/props'

const {debug} = useDebug('containers/Genre/GenreSelector', )

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
    genreId?:       string
    genre?:         Genre|GenreStub
    setGenre?:      (genre:Genre|GenreStub) => void
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
  genreId,
  genre, 
  setGenre, 
  label='Genre', 
  showLabel=true, 
  allowAll=false, 
  className='', 
  required=false
}:GenreSelectorProps) => {

  const [genreList, setGenreList] = useState<KeyVal[]>([])
  const [genres, setGenres] = useState<GenreStub[]>([])

  const getGenres = async () => {
    const {stubs} = useApi.genre()
    const genres = await stubs()
    if (genres) {
      setGenres(() => genres)
      const sortMap = genres.sort((a,b) => a.title > b.title ? 1 : -1).map((g:GenreStub) => { return {value: g.id, key: g.title} as KeyVal})
      setGenreList(() => allowAll ? [{key: 'All', value: ''},...sortMap] : sortMap)
    }
    if (!genre && genreId !== undefined && setGenre) {
      const defaultGenre = genres.find((g:GenreStub) => g.id === genreId)
      if (defaultGenre !== undefined && setGenre !== undefined) setGenre(defaultGenre)
    }
  }

  const onChange = (kv:KeyVal) => {
    debug('onChange', kv)
    if (!setGenre) return
    const g = genres.find((g:Genre) => g.id === kv.value)
    debug('setting Genre', g)
    setGenre(g!)
    handleClose()
  }

  const ITEM_HEIGHT = 64
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const border = required ? 
    (!genre ? 'border-warning': 'border-success') : 
     !genre ? 'border-info' : 'border-success'

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  
  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    getGenres()
  }, [])
  
  return (
    <TailwindLabel label='Genre' cardClassName={className} valid={genre!==undefined&&genre!==null} required={required} >
      <div 
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        className={`bg-base-300 bg-opacity-50 border rounded-md p-2 cursor-pointer ${border}`}
        >
        {genre?.title ?? "Choose genre"}
      </div>
      <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{style: {maxHeight: ITEM_HEIGHT * 8}}}
        >
        {genreList.map((option) => (
          <MenuItem key={option.key} selected={option.value===genre?.id} onClick={() => onChange(option)} className=' hover:text-primary'>
            <div className='p-2'>{option.key}</div>
          </MenuItem>
        ))}
      </Menu>
    </TailwindLabel>
  )
}

export default GenreSelector