import {Author, AuthorStub} from "prisma/prismaContext"

export const toAuthor = (stub: AuthorStub | AuthorStub[]):Author|Author[] => {
  if (Array.isArray(stub)) {
    return stub.map(s => toAuthor(s)) as Author[]
  }
  
  return { id: stub.id, userId: stub.userId, visible: stub.visible, createdAt: stub.createdAt, updatedAt: stub.updatedAt } as Author
}