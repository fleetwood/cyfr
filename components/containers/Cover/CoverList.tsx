import ImageList from '@mui/material/ImageList'
import { CoverStub } from 'prisma/prismaContext'
import React from 'react'
import { cloudinary } from 'utils/cloudinary'
import CoverStubView from './CoverStubView'
import CoverDefault from './CoverDefault'

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
      <CoverDefault height={height} onSelect={onSelect} />
      {covers.map((cover) => <CoverStubView cover={cover} height={height} onSelect={onSelect} key={cover.id} /> )}
    </ImageList>
  )
}

export default CoverList
