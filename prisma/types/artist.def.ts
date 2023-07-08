import { Artist, UserStub } from 'prisma/prismaContext'

export type ArtistStub = Artist & {
  user: UserStub
}

export const ArtistStubInclude = {include: {
    user: {
      select: {
        name: true,
        id: true,
        slug: true,
        image: true,
      },
    },
}}
