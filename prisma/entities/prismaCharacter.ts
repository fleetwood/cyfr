import { Chapter, Character, CharacterDetail, CharacterStub, CharacterUpsertProps, PrismaBook, Share, ShareDeleteProps, ShareFeed } from "../prismaContext"
import useDebug from "../../hooks/useDebug"
import { now, sortChapters } from "../../utils/helpers"

const {debug, info, fileMethod} = useDebug('entities/prismaCharacter', 'DEBUG')

const detail = async (id: string): Promise<CharacterDetail | null> => {
  debug('detail', id)
  try {
    return await prisma.character.findUnique({where: {id}}) as CharacterDetail
  } catch (error) {
    debug('detail ERROR', error)
    throw error
  }
}

const stub = async (id: string): Promise<CharacterStub | null> => {
  debug('stub', id)
  try {
    return await prisma.character.findUnique({where: {id}}) as CharacterStub
  } catch (error) {
    debug('stub ERROR', error)
    throw error
  }
}

const upsert = async (character:CharacterUpsertProps) => {
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
      bookId
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
          id: bookId
        }
      }
    }
    debug('upsert data', {data})
    //TODO bc for some stupid reason if id is undefined the where statement is just empty oy
    const result = character.id !== undefined 
      ? await prisma.character.update({where: {id: character.id}, data})
      : await prisma.character.create({data})

    if (result) {
      debug('upsert', result)
      return result
    }

    throw {code: fileMethod('upsert'), message :'Did not obtain an upsert result'}
  } catch (error) {
    debug('upsert ERROR', error)
    throw error
  }
}

export const PrismaCharacter = { detail, stub, upsert }
