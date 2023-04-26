import { Character } from '@prisma/client'
import React from 'react'

type CharacterListProps = {
    characters?: Character[] | undefined
}

const CharacterList = ({characters}:CharacterListProps) => {
    return (
    <div>
        <h4>Characters [NI]</h4>
        {characters && characters.map((c:Character) => (
            <span>{c.name}</span>
        ))}
    </div>
)}

export default CharacterList