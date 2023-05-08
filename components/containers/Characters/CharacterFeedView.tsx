import React from 'react'
import useDebug from '../../../hooks/useDebug'
import { MainFeed } from '../../../prisma/types'

const {debug, jsonBlock} = useDebug('containers/Characters/CharacterFeedView', 'DEBUG')

type CharacterFeedViewProps = {
    item: MainFeed
}

const CharacterFeedView = ({item}:CharacterFeedViewProps) => {
    const {character,isShare,author} = item
  return (
    <>
      <div className="font-semibold">Character</div>
      {jsonBlock(character)}
    </>
  )
}

export default CharacterFeedView