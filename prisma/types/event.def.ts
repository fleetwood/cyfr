import { Book, Character, Gallery, PostStub, ImageStub, User, BookStub, GalleryStub, CharacterStub, CreatorStub } from "../prismaContext"

export type EventStub = Event & {
    creator:    CreatorStub
}