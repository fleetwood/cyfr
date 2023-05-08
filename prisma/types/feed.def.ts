import { Book, Character, Gallery, PostStub, ImageStub, User, BookStub } from "./../prismaContext"

export type MainFeed = {
    id:         string
    createdAt:  string
    updatedAt:  string
    visible:    boolean
    author:     User
    isShare:    boolean
    post?:      PostStub
    gallery?:   Gallery
    image?:     ImageStub
    character?: Character
    book?:      BookStub
}
