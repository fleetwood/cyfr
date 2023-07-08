import { Author, UserStub } from 'prisma/prismaContext'

export type AuthorStub = Author & {
  user: UserStub
}

export const AuthorStubInclude = {include: {
    user: {
      select: {
        name: true,
        id: true,
        slug: true,
        image: true,
      },
    },
}}
