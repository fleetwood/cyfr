import { Agent, Publisher, UserStub } from 'prisma/prismaContext'

export type AgentDetail = Agent & {
  user:       UserStub
  publisher:  Publisher
  _count: {
    authors:  number
    books:    number
    likes:    number
    reviews:  number
  }
}

export const AgentDetailInclude = {include: {
  user: {
    select: {
      name: true,
      id: true,
      slug: true,
      image: true,
    },
  },
  publisher: true,
  _count: {
    select: {
      authors: true,
      books: true,
      likes: true,
      reviews: true
    }
  }
}}


export type AgentStub = Agent & {
  user:       UserStub
  publisher:  Publisher
  _count: {
    authors:  number
    books:    number
    likes:    number
    reviews:  number
  }
}

export const AgentStubInclude = { include: {
    user: { select: {
      id: true,
      name: true,
      image: true,
      slug: true,
      membership: {select: {
        id:         true,
        expiresAt:  true,
        type:       { select: {
          id:     true,
          name:   true,
          level:  true
        }}
      }}
    }},
    publisher: true,
    _count: {
      select: {
        authors: true,
        books: true,
        likes: true,
        reviews: true
      }
    }
}}
