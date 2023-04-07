import { Book, BookCategory, BookStatus, Chapter, Character, Follow, Gallery, Genre, Like, User } from "../prismaContext";

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
  fans: Follow[],
  gallery: Gallery,
  genre: Genre,
  likes: Like[]
}

export const BookDetailInclude = {
  authors: true,
  categories: true,
  chapters: true,
  characters: true,
  fans: true,
  gallery: true,
  genre: true,
  likes: true
}

export type BookCreateProps = {
  cover: string
  title: string,
  active: boolean,
  prospect: boolean,
  authorId: string,
  genreId: string,
  categories?: BookCategory[] | null,
  back?: string,
  status?: BookStatus|null,
  synopsis?: string
}

export type BookDeleteProps = {
  bookId: string,
  authorId: string
}
