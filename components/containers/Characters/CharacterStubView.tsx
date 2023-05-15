import React from 'react'
import useDebug from '../../../hooks/useDebug'
import { CharacterStub } from '../../../prisma/prismaContext'

const {debug, jsonBlock} = useDebug('containers/Characters/CharacterFeedView')

type CharacterFeedViewProps = {
    character: CharacterStub
}

const CharacterStubView = ({character}:CharacterFeedViewProps) => {
  return (
    <>
      <div className="font-semibold">Character</div>
      {jsonBlock(character)}
    </>
  )
}

export default CharacterStubView