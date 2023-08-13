import { Permission, PermissionCreateProps, PermissionStub } from 'prisma/prismaContext'

export const toPermission = (
  stub: PermissionStub | PermissionStub[]
): Permission | Permission[] => {
  if (Array.isArray(stub)) {
    return stub.map((s) => toPermission(s)) as Permission[]
  }

  return {
    id:         stub.id,
    createdAt:  stub.createdAt,
    updatedAt:  stub.updatedAt,
    agent:      stub.agent ?? ['NONE'],
    editor:     stub.editor ?? ['NONE'],
    author:     stub.author ?? ['NONE'],
    artist:     stub.artist ?? ['NONE'],
    member:     stub.member ?? ['NONE'],
    public:     stub.public ?? ['NONE'],

    friend:     stub.friend ?? ['NONE'],
    stan:       stub.stan ?? ['NONE'],
    following:  stub.following ?? ['NONE'],
    fan:        stub.fan ?? ['NONE'],
    follower:   stub.follower ?? ['NONE'],
  } as Permission
}


export const toPermissionCreateProps = (
  stub: any
): PermissionCreateProps | PermissionCreateProps[] => {
  if (Array.isArray(stub)) {
    return stub.map((s) => toPermissionCreateProps(s)) as PermissionCreateProps[]
  }
  return {
    agent: stub.agent ?? ['NONE'],
    editor: stub.editor ?? ['NONE'],
    author: stub.author ?? ['NONE'],
    artist: stub.artist ?? ['NONE'],
    member: stub.member ?? ['NONE'],
    public: stub.public ?? ['NONE'],

    friend: stub.friend ?? ['NONE'],
    stan: stub.stan ?? ['NONE'],
    following: stub.following ?? ['NONE'],
    fan: stub.fan ?? ['NONE'],
    follower: stub.follower ?? ['NONE'],
  }
}