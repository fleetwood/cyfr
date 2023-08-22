import React from 'react'
import useDebug from 'hooks/useDebug'
import { CharacterDetail, CharacterStub } from 'prisma/prismaContext'

const {debug, jsonBlock} = useDebug('containers/Characters/CharacterFeedView')

type CharacterFeedViewProps = {
  characterStub?:   CharacterStub
  characterDetail?: CharacterDetail
}

const CharacterStubView = ({characterStub, characterDetail}:CharacterFeedViewProps) => {
  return (
    <>
      {characterStub && <div className="font-semibold">Character Stub</div>}
      {characterDetail && <div className="font-semibold">Character Detail</div>}
    </>
  )
}

export default CharacterStubView