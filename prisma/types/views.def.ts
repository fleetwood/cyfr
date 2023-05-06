// 20230506153043
// http://localhost:3000/api/views
export type v_author_detail = {
  id: string
  name: string
  email: string
  emailVerified: string // timestamp
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
  emailVerified: string // timestamp
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
  createdAt: string // timestamp
  updatedAt: string // timestamp
  startedAt: string // timestamp
  completeAt: string // timestamp
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
  createdAt: string // timestamp
  updatedAt: string // timestamp
  startedAt: string // timestamp
  completeAt: string // timestamp
  active: boolean
  status: any // enum
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
  createdAt: string // timestamp
  updatedAt: string // timestamp
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
  createdAt: string // timestamp
  updatedAt: string // timestamp
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
  createdAt: string // timestamp
  updatedAt: string // timestamp
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
  createdAt: string // timestamp
  updatedAt: string // timestamp
}
