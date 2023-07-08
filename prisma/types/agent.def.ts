import { Agent, UserStub } from 'prisma/prismaContext'

export type AgentStub = Agent & {
  user: UserStub
}

export const AgentStubInclude = {include: {
    user: {
      select: {
        name: true,
        id: true,
        slug: true,
        image: true,
      },
    },
}}
