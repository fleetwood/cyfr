export type v_author_detail = {
  slug: string
  image: string
  email: string
  name: string
  id: string
  emailVerified: string // timestamp
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
  membershipId: string
}

export type v_author_stub = {
  follows: number
  emailVerified: string // timestamp
  membership: {}
  email: string
  name: string
  id: string
  posts: number
  membershipId: string
  likes: number
  slug: string
  image: string
  shares: number
  galleries: {}
  books: {}
  fans: number
  followers: number
  stans: number
}

export type v_book_detail = {
  words: number
  galleryId: string
  back: string
  synopsis: string
  hook: string
  genreId: string
  coverId: string
  slug: string
  title: string
  id: string
  chapters: {}
  characters: {}
  categories: {}
  active: boolean
  completeAt: string // timestamp
  startedAt: string // timestamp
  updatedAt: string // timestamp
  createdAt: string // timestamp
  status: any // enum
  prospect: boolean
  fiction: boolean
  genre: {}
  gallery: {}
  authors: {}
  cover: {}
  likes: {}
  follows: {}
  shares: {}
}

export type v_book_stub = {
  fiction: boolean
  hook: string
  coverId: string
  slug: string
  title: string
  genreId: string
  galleryId: string
  prospect: boolean
  status: any // enum
  active: boolean
  completeAt: string // timestamp
  startedAt: string // timestamp
  updatedAt: string // timestamp
  createdAt: string // timestamp
  id: string
  back: string
  synopsis: string
  categories: {}
  characters: {}
  chapters: {}
  shares: number
  follows: number
  likes: number
  cover: {}
  authors: {}
  genre: {}
  words: number
}

export type v_chapter_stub = {
  words: number
  createdAt: string // timestamp
  updatedAt: string // timestamp
  active: boolean
  order: number
  characters: {}
  gallery: {}
  title: string
  galleryId: string
  bookId: string
  content: string
  id: string
}

export type v_character_stub = {
  gallery: {}
  archetype: string
  galleryId: string
  backstory: string
  likes: {}
  title: string
  id: string
  fans: {}
  followers: {}
  shares: {}
  name: string
  familyName: string
  givenName: string
  middleName: string
  thumbnail: string
  age: string
  role: string
  description: string
  createdAt: string // timestamp
  updatedAt: string // timestamp
  active: boolean
  books: {}
  chapters: {}
}

export type v_follower_stub = {
  isFan:        boolean
  bookId:       string
  characterId:  string
  followingId:  string
  followerId:   string
  character:    {}
  book:         {}
  user:         {}
  updatedAt:    string // timestamp
  createdAt:    string // timestamp
  id:           string
}

export type v_following_stub = {
  createdAt: string // timestamp
  updatedAt: string // timestamp
  isFan: boolean
  user: {}
  book: {}
  character: {}
  bookId: string
  id: string
  followingId: string
  followerId: string
  characterId: string
}

export type v_gallery_detail = {
  createdAt: string // timestamp
  updatedAt: string // timestamp
  visible: boolean
  author: {}
  images: {}
  likes: {}
  shares: {}
  id: string
  title: string
  description: string
  creatorId: string
  shareId: string
}

export type v_gallery_stub = {
  title: string
  likes: {}
  images: {}
  createdAt: string // timestamp
  updatedAt: string // timestamp
  shareId: string
  author: {}
  id: string
  visible: boolean
  description: string
  shares: {}
  creatorId: string
}

export type v_genre_all = {
  books: {}
  createdAt: string // timestamp
  updatedAt: string // timestamp
  galleryId: string
  gallery: {}
  description: string
  totalbooks: number
  title: string
  slug: string
  id: string
}

export type v_genre_detail = {
  createdAt: string // timestamp
  books: {}
  title: string
  description: string
  galleryId: string
  id: string
  slug: string
  updatedAt: string // timestamp
  gallery: {}
  totalbooks: number
}

export type v_genre_stub = {
  books: {}
  description: string
  createdAt: string // timestamp
  updatedAt: string // timestamp
  galleryId: string
  title: string
  slug: string
  id: string
  gallery: {}
}

export type v_like_detail = {
  creatorId: string
  updatedAt: string // timestamp
  createdAt: string // timestamp
  gallery: {}
  image: {}
  comment: {}
  character: {}
  book: {}
  post: {}
  author: {}
  id: string
  postId: string
  galleryId: string
  imageId: string
  commentId: string
  characterId: string
  bookId: string
}

export type v_like_stub = {
  characterId: string
  updatedAt: string // timestamp
  postId: string
  commentId: string
  author: {}
  creatorId: string
  galleryId: string
  imageId: string
  bookId: string
  id: string
  createdAt: string // timestamp}
}

export type v_share_detail = {
  id: string
  characterId: string
  imageId: string
  postId: string
  author: {}
  character: {}
  bookId: string
  image: {}
  gallery: {}
  post: {}
  book: {}
  createdAt: string // timestamp
  updatedAt: string // timestamp
  galleryId: string
  visible: boolean
  creatorId: string
}

export type v_share_stub = {
  characterId: string
  postId: string
  galleryId: string
  imageId: string
  createdAt: string // timestamp
  author: {}
  updatedAt: string // timestamp
  creatorId: string
  bookId: string
}
