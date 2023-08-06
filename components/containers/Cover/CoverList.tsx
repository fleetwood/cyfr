import ImageList from '@mui/material/ImageList'
import { CoverStub } from 'prisma/prismaContext'
import React from 'react'
import { cloudinary } from 'utils/cloudinary'

type CoverListProps = {
  covers: CoverStub[]
  listHeight?: number
  listWidth?: number
  cols?: number
  height?: number
  width?: number
  onSelect?: (cover: CoverStub) => any
}

const CoverList = ({height=160, ...props}: CoverListProps) => {
  const {
    covers,
    cols,
    listHeight,
    listWidth,
		width,
    onSelect,
  } = props

  return (
    <ImageList sx={{ height: listHeight ?? 400, width: listWidth ?? 600 }} cols={cols ?? 6} rowHeight={height}>
      {covers.map((cover) => (
        <img
					className={`${onSelect ? 'cursor-pointer hover:scale-110' : ''}`}
          src={cloudinary.resize({ url: cover.image.url, height })}
          srcSet={cloudinary.resize({ url: cover.image.url, height })}
          alt={cover.creator?.name}
          loading="eager"
					onClick={onSelect ? () => onSelect(cover) : () =>{}}
        />
      ))}
    </ImageList>
  )
}

export default CoverList
