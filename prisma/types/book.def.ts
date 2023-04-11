import { Book, BookCategory, BookStatus, Chapter, Character, CyfrUser, Follow, Gallery, Genre, Image, Like, User } from "../prismaContext";

export type BookList = Book & {

}

export const BookListInclude = {
}

export type BookFeed = Book & {
  authors: User[],
  categories: BookCategory[],
  chapters: Chapter[],
  fans: Follow[],
  gallery: Gallery,
  genre: Genre,
  likes: Like[]
}

export const BookFeedInclude = {
  authors: true,
  categories: true,
  chapters: true,
  characters: true,
  fans: true,
  gallery: true,
  genre: true,
  likes: true
 }

export type BookDetail = Book & {
  authors: User[],
  categories: BookCategory[],
  chapters: Chapter[],
  characters: Character[],
  follows: Follow[],
  gallery: Gallery,
  genre: Genre,
  likes: Like[]
  cover: Image
}

export const BookDetailInclude = {
  authors: true,
  categories: true,
  chapters: true,
  characters: true,
  follows: true,
  gallery: true,
  genre: true,
  likes: true,
  cover: true
}

export type BookUpsertProps = {
  cover:        string
  title:        string,
  slug?:        string,
  active:       boolean,
  prospect:     boolean,
  authors:      User[]|CyfrUser[],
  genreId:      string,
  status?:      BookStatus|null,
  categories?:  BookCategory[] | null,
  back?:        string,
  hook?:        string,
  synopsis?:    string
  words?:       number
}

export type BookDeleteProps = {
  bookId: string,
  authorId: string
}
