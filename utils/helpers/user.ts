import useDebug from 'hooks/useDebug'
import {CreatorStub, UserInfoType, UserStub, UserTypes} from 'prisma/prismaContext'
import {KeyVal} from 'types/props'
import {capFirstLetter} from './generic'

const { debug } = useDebug('utils/helpers/user', 'DEBUG')

export const UserInfoValues = (result: UserInfoType) =>{
  debug('UserInfoValues', {result})
  return [
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
    .filter((v) => v.value !== null)}

export const GetUserType = (user:UserStub|CreatorStub):UserTypes => {
  try {
    debug('GetUserType', { user, name: user.membership.type.name ?? 'unknown'})
    return user.membership.type.name as UserTypes
  } catch (error) {
    return 'Reader'
  }
}