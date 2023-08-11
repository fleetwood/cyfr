import useDebug from 'hooks/useDebug'
import {UserInfoType} from 'prisma/prismaContext'
import {KeyVal} from 'types/props'
import {capFirstLetter} from './generic'

const { debug } = useDebug('utils/helpers/user', )


export const UserInfoValues = (result: UserInfoType) =>
  [
    'followers',
    'fans',
    'following',
    'stans',
    'likes',
    'reviews',
    'reads',
    'books',
    'covers',
    'galleries',
    'agent',
    'publisher',
    'authors',
  ]
    .map((info) => {
      return {
        key: capFirstLetter(info),
        // @ts-ignore
        value: result[info] ?? null,
      } as KeyVal
    })
    .filter((v) => v.value !== null)