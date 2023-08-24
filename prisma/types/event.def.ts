import {CreatorStub,Event} from "prisma/prismaContext"

export type EventStub = Event & {
    creator:    CreatorStub
}

export const EventStubInclude = {
  include: {
    // CreatorStubSelect
    creator: {
      select: {
        id: true,
        name: true,
        image: true,
        slug: true,
        membership: {
          select: {
            id: true,
            expiresAt: true,
            type: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
        },
      },
    },
  },
}