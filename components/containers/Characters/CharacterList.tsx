import { BookApi, Character } from '../../../prisma/prismaContext'

type CharacterListProps = {
    forBook :   BookApi
    onSelect?:  (character:Character) => void
}

const CharacterList = ({forBook, onSelect}:CharacterListProps) => {
    return (
    <div>
        {forBook.characters && forBook.characters.map((c:Character) => (
            <span onClick={() => onSelect ? onSelect(c) : {}}>{c.name}</span>
        ))}
    </div>
)}

export default CharacterList