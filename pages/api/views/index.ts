import { NextApiRequest, NextApiResponse } from "next"
import { PrismaViews } from "../../../prisma/prismaContext"

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const views = await PrismaViews.getViews() // call getViews function
    res.status(200).json(views) // return views as JSON
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal Server Error" }) // handle errors
  }
}

export type v_author_detail = {
  id: string
  name: string
  email: string
  emailVerified: string
  image: string
  slug: string
  membershipId: string
  membership: {}
  posts: {}
  likes: {}
  shares: {}
  follows: {}
  stans: {}
  followers: {}
  fans: {}
  books: {}
  galleries: {}
}
export type v_author_stub = {
  id: string
  name: string
  email: string
  emailVerified: string
  image: string
  slug: string
  membershipId: string
  membership: {}
  posts: number
  likes: number
  shares: number
  follows: number
  stans: number
  followers: number
  fans: number
  books: {}
  galleries: {}
}
export type v_book_detail = {
  id: string
  createdAt: string
  updatedAt: string
  startedAt: string
  completeAt: string
  active: boolean
  status: any // enum
  prospect: boolean
  fiction: boolean
  title: string
  slug: string
  coverId: string
  genreId: string
  hook: string
  synopsis: string
  back: string
  words: number
  galleryId: string
  genre: {}
  gallery: {}
  authors: {}
  cover: {}
  likes: {}
  follows: {}
  shares: {}
  chapters: {}
  characters: {}
  categories: {}
}
export type v_book_stub = {
  id: string
  createdAt: string
  updatedAt: string
  startedAt: string
  completeAt: string
  active: boolean
  status: any //enum
  prospect: boolean
  fiction: boolean
  title: string
  slug: string
  coverId: string
  hook: string
  synopsis: string
  back: string
  words: number
  galleryId: string
  genreId: string
  genre: {}
  authors: {}
  cover: {}
  likes: number
  follows: number
  shares: number
  chapters: {}
  characters: {}
  categories: {}
}
export type v_chapter_stub = {
  id: string
  createdAt: string
  updatedAt: string
  active: boolean
  content: string
  words: number
  bookId: string
  galleryId: string
  order: number
  title: string
  characters: {}
  gallery: {}
}
export type v_character_stub = {
  id: string
  createdAt: string
  updatedAt: string
  active: boolean
  name: string
  familyName: string
  givenName: string
  middleName: string
  thumbnail: string
  age: string
  role: string
  description: string
  backstory: string
  title: string
  archetype: string
  galleryId: string
  books: {}
  chapters: {}
  gallery: {}
  likes: {}
  shares: {}
  followers: {}
  fans: {}
}
export type v_follower_stub = {
  id: string
  createdAt: string
  updatedAt: string
  isFan: boolean
  followerId: string
  followingId: string
  characterId: string
  bookId: string
  user: {}
  book: {}
  character: {}
}
export type v_following_stub = {
  id: string
  createdAt: string
  updatedAt: string
  isFan: boolean
  followerId: string
  followingId: string
  characterId: string
  bookId: string
  user: {}
  book: {}
  character: {}
}
export type v_gallery_detail = {
  id: string
  createdAt: string
  updatedAt: string
  visible: boolean
  title: string
  description: string
  creatorId: string
  shareId: string
  author: {}
  images: {}
  likes: {}
  shares: {}
}
export type v_gallery_stub = {
  id: string
  createdAt: string
  updatedAt: string
  visible: boolean
  title: string
  description: string
  author: {}
  images: {}
  book: {}
  likes: {}
  shares: {}
}
export type v_genre_all = {
  id: string
  createdAt: string
  updatedAt: string
  slug: string
  title: string
  description: string
  galleryId: string
  gallery: {}
  books: {}
  totalbooks: number
}
export type v_genre_detail = {
  id: string
  createdAt: string
  updatedAt: string
  slug: string
  title: string
  description: string
  galleryId: string
  gallery: {}
  books: {}
  totalbooks: number
}
export type v_genre_stub = {
  id: string
  createdAt: string
  updatedAt: string
  slug: string
  title: string
  description: string
  galleryId: string
  books: {}
  gallery: {}
}
export type v_like_detail = {
  author: {}
  post: {}
  book: {}
  character: {}
  comment: {}
  image: {}
  gallery: {}
  id: string
  creatorId: string
  postId: string
  createdAt: string
  updatedAt: string
  galleryId: string
  imageId: string
  commentId: string
  characterId: string
  bookId: string
}
export type v_like_stub = {
  author: {}
  id: string
  creatorId: string
  postId: string
  createdAt: string
  updatedAt: string
  galleryId: string
  imageId: string
  commentId: string
  characterId: string
  bookId: string
}
export type v_share_detail = {
  author: {}
  character: {}
  image: {}
  gallery: {}
  post: {}
  book: {}
  id: string
  createdAt: string
  updatedAt: string
  visible: boolean
  creatorId: string
  postId: string
  galleryId: string
  imageId: string
  bookId: string
  characterId: string
}
export type v_share_stub = {
  author: {}
  creatorId: string
  postId: string
  galleryId: string
  imageId: string
  characterId: string
  bookId: string
  createdAt: string
  updatedAt: string
}
