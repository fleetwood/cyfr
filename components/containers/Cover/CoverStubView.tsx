import {CoverStub} from 'prisma/prismaContext'
import React from 'react'
import {cloudinary} from 'utils/cloudinary'

export type CoverStubViewProps = {
    cover:  CoverStub
    height: number
    onSelect?:  (cover:CoverStub) => any
}

const CoverStubView = ({cover, onSelect, height}:CoverStubViewProps) => {
  return (
    <img
      className={`${onSelect ? 'cursor-pointer hover:scale-110' : ''}`}
      src={cloudinary.resize({ url: cover.image.url, height })}
      srcSet={cloudinary.resize({ url: cover.image.url, height })}
      alt={cover.creator?.name}
      loading="eager"
      onClick={onSelect ? () => onSelect(cover) : () => {}}
    />
  )
}

export default CoverStubView