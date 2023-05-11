import React from 'react'
import { CharacterDetail, CharacterStub } from '../../../prisma/prismaContext'

type CharacterFooterProps = {
    character: CharacterDetail | CharacterStub
}

const CharacterFooter = ({character}:CharacterFooterProps) => {
  return (
    <>
        <div>Likes: {character.likes.length}</div>
        <div>Shares: {character.shares.length}</div>
    </>
  )
}

export default CharacterFooter