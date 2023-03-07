import { Book, BookCategory, BookStatus, Chapter, Follow, Gallery, Genre, Like, User } from "../prismaContext";

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

const DefaultCovers = [
  {
    id: "9d44715a-41a6-44f7-a1db-e369e36f1b1f",
    genre: "Adventure",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/v8ulauruqawzycm9bwls.png"
  },
  {
    id: "clexewr6j000cjpkf169ibe5n",
    genre: "Travel",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/c4k2shpaeddqf48gpkip.png"
  },
  {
    id: "clexey37h000ejpkfum5qww5o",
    genre: "Humor",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/ygoprcudzb8xxn2fw318.png"
  },
  {
    id: "clex5pbzr0000pa0hheroarz7",
    genre: "Contemporary",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/hkpkkttkzw7oel6gkmop.jpg"
  },
  {
    id: "clex7rati0000jp0o3a0s542j",
    genre: "Romance",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/ddz1hkksqlejiianivha.png"
  },
  {
    id: "clewafd3h0000un0h1ng3rmop",
    genre: "Fantasy",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/yxwpvidbivknnpcewo3k.png"
  },
  {
    id: "clexay2sx000ajp0o7b92d6sr",
    genre: "Dystopian",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/fwhkgvgo2cytnz2hnecx.png"
  },
  {
    id: "clexb0spr000cjp0o9o11yxsi",
    genre: "Mystery",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/t0xcomianfps9vrcxu5b.png"
  },
  {
    id: "clexb6ytk000ejp0olo8heye1",
    genre: "Horror",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/bflg0vz7qesuewyk3glu.png"
  },
  {
    id: "clexbeil2000ijp0o9wga37a3",
    genre: "Thriller",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/ilycomwc2u5gcfivqjlb.png"
  },
  {
    id: "clexbl04e000kjp0osdwur89a",
    genre: "Paranormal",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/vpevd9rvhrg293dv79ly.png"
  },
  {
    id: "clexc06g3000mjp0oudy9o5dj",
    genre: "Historical Fiction",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/rwimgg0dzrjyevvqvhal.png"
  },
  {
    id: "clexcikhd000ojp0o0bde16u4",
    genre: "Science Fiction",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/zhyeycsw2marg6brakgl.png"
  },
  {
    id: "clexeh4180000jpkf61qiej7a",
    genre: "Memoir",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/flae1i3g3cvr6kh38exx.jpg"
  },
  {
    id: "clexekd440002jpkf1hw5ejnb",
    genre: "Cookbook",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/zedp62qqdpq2ljry7acr.jpg"
  },
  {
    id: "clexemjbw0004jpkfjx0lmna2",
    genre: "Art",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/ge6nqctlccx4uzbgegig.png"
  },
  {
    id: "clexeogsk0006jpkf58md47vi",
    genre: "Self-help",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/rj9a8qbfqnfhtio0vonm.png"
  },
  {
    id: "clexeqluv0008jpkflmlffk4t",
    genre: "Health",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/kv6azghbeyjyfbcz67ml.png"
  },
  {
    id: "clexeugwv000ajpkfsjltlqv9",
    genre: "History",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/icxso2azk9gsrlz7irvs.png"
  },
  {
    id: "clexf1549000gjpkfkqw6gky6",
    genre: "Childrens Books",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/ww94zxednqjnw5ryntrt.png"
  },
  {
    id: "clexf61xa000ijpkf6bp4vjz6",
    genre: "Religion",
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/h8nnqgkpoabmd5ebr5ve.png"
  }
]

export const getDefaultCover = (id:string) => {
  return DefaultCovers.find(p => p.id === id)?.url
}
