import {
  BookStub,
  ChapterStub,
  Character,
  CharacterStub,
} from "../../../prisma/prismaContext"

export type CharacterListVariant = 'vertical' | 'horizontal'

type CharacterListProps = {
  characters: CharacterStub[]|undefined
  onSelect?: (character: Character) => void
  variant?: CharacterListVariant
}

const CharacterList = ({ characters, onSelect, variant = 'horizontal' }: CharacterListProps) => {
  return (
    <div className={variant === "horizontal" ? 'flex space-x-2' : 'flex flex-row space-y-2'}>
      {characters?.map((c: Character) => (
        <div className={`font-semibold font-ibarra border-primary mr-2`} onClick={() => (onSelect ? onSelect(c) : {})}>
            {c.name}
        </div>
      ))}
    </div>
  )
}

export default CharacterList
