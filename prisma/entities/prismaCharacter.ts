import useDebug from 'hooks/useDebug'
import {
  Character,
  CharacterUpsertProps,
  Like,
  PrismaLike,
  PrismaShare,
  Share,
} from 'prisma/prismaContext'

const { debug, info, fileMethod } = useDebug('entities/prismaCharacter')

const detail = async (id: string): Promise<Character | null> =>
  await prisma.character.findUnique({ where: { id } })

const stub = async (id: string): Promise<Character | null> =>
  await prisma.character.findUnique({ where: { id } })

const upsert = async (character: CharacterUpsertProps) => {
  debug('upsert', character)
  try {
    const {
      active,
      name,
      familyName,
      givenName,
      middleName,
      thumbnail,
      age,
      role,
      description,
      backstory,
      title,
      archetype,
      bookId,
    } = character
    const data = {
      active,
      name,
      familyName,
      givenName,
      middleName,
      thumbnail,
      age,
      role,
      description,
      backstory,
      title,
      archetype,
      books: {
        connect: {
          id: bookId,
        },
      },
    }
    debug('upsert data', { data })
    //TODO bc for some stupid reason if id is undefined the where statement is just empty oy
    const result =
      character.id !== undefined
        ? await prisma.character.update({ where: { id: character.id }, data })
        : await prisma.character.create({ data })

    if (result) {
      debug('upsert', result)
      return result
    }

    throw {
      code: fileMethod('upsert'),
      message: 'Did not obtain an upsert result',
    }
  } catch (error) {
    debug('upsert ERROR', error)
    throw error
  }
}

/**
 * Method references {@link PrismaLike.likeCharacter}
 * @param characterId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const like = async (props: {
  characterId: string
  creatorId: string
}): Promise<Like> => PrismaLike.likeCharacter(props)

/**
 * Method references {@link PrismaShare.shareCharacter}
 * @param characterId: String
 * @param creatorId: String
 * @returns: {@link Like}
 */
const share = async (props: {
  characterId: string
  creatorId: string
}): Promise<Share> => PrismaShare.shareCharacter(props)

export const PrismaCharacter = { detail, like, share, stub, upsert }
