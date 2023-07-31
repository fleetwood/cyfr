import { CreatorStub, CreatorStubSelect, Event } from "prisma/prismaContext"

export type EventStub = Event & {
    creator:    CreatorStub
}

export const EventStubInclude = { include: {
    creator:    CreatorStubSelect
}}