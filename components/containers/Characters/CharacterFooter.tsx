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
        <div>Likes: {character.likes.length}</div>
        <div>Shares: {character.shares.length}</div>
    </>
  )
}

export default CharacterFooter