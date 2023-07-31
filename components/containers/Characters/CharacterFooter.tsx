import React from 'react'
import { CharacterDetail, CharacterStub } from '../../../prisma/prismaContext'

type CharacterFooterProps = {
    character:    CharacterDetail | CharacterStub
    onUpdate?:  () => void
}

const CharacterFooter = ({character, onUpdate}:CharacterFooterProps) => {
  const update = () => {
    onUpdate ? onUpdate() : {}
  }

  return (
    <>
      <div>Likes: ({character._count.likes})</div>
      <div>Shares: ({character._count.shares})</div>
    </>
  )
}

export default CharacterFooter