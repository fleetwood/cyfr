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

export const toUI = (p:PermissionStub|PermissionCreateProps)=> {
  return [
    {label: 'Agent', role: p.agent},
    {label: 'Artist', role: p.artist},
    {label: 'Author', role: p.author},
    {label: 'Editor', role: p.editor},
    {label: 'Friend', role: p.friend},
    {label: 'Fan', role: p.fan},
    {label: 'Follower', role: p.follower},
    {label: 'Stan', role: p.stan},
    {label: 'Following', role: p.following},
    {label: 'Public', role: p.public},
    {label: 'Member', role: p.member},
  ]
}

export const DefaultPermissionProps: PermissionCreateProps = {
  agent:      ['NONE'],
  editor:     ['NONE'],
  author:     ['NONE'],
  artist:     ['NONE'],

  friend:     ['NONE'],
  stan:       ['NONE'],
  following:  ['NONE'],
  fan:        ['NONE'],
  follower:   ['NONE'],

  member:     ['NONE'],
  public:     ['NONE'],
}
export const DefaultEffectivePermissionProps: PermissionCreateProps = {
  agent:      [],
  editor:     [],
  author:     [],
  artist:     [],

  friend:     [],
  stan:       [],
  following:  [],
  fan:        [],
  follower:   [],

  member:     [],
  public:     [],
}