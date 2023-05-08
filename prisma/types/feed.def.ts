import { Book, Character, Gallery, PostStub, ImageStub, User, BookStub, GalleryStub, CharacterStub } from "./../prismaContext"

export type MainFeed = {
    id:         string
    createdAt:  string
    updatedAt:  string
    visible:    boolean
    author:     User
    isShare:    boolean
    post?:      PostStub
    gallery?:   GalleryStub
    image?:     ImageStub
    character?: CharacterStub
    book?:      BookStub
}
