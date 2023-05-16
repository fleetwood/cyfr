import { Book, BookCategory, BookStatus, Chapter, ChapterStub, Character, CharacterStub, CyfrUser, Gallery, Genre, Image, User, UserFollow, UserStub } from "../prismaContext"

// TODO Create/Verify view in db
export type BookStub = Book & {
  follows:    UserFollow[]
  likes:      UserStub[]
  shares:     UserStub[]
  chapters:   Chapter[]
  characters: Character[]
  // relations
  authors:    UserStub[],
  cover?:     Image
  genre:      Genre
  categories: BookCategory[]
}

// TODO Create/Verify view in db
export type BookDetail = Book & {
  genre:      Genre
  //TODO: Gallery should be stub
  gallery:    Gallery
  authors:    UserStub[]
  cover:      Image
  follows:    UserFollow[]
  likes:      UserStub[]
  shares:     UserStub[]
  chapters:   ChapterStub[]
  characters: CharacterStub[]
  categories: BookCategory[]
}

export type BookUpsertProps = {
  id?:          string|null
  cover?:       string
  title:        string,
  slug?:        string,
  active:       boolean,
  fiction:      boolean,
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

// TODO This does not account for startedAt and completeAt bc @#$@#$ Date -> String
export type BookApiUpdate = {
  props: {
    title?:       string | null
    active?:      boolean
    prospect?:    boolean
    fiction?:     boolean
    status?:      BookStatus
    back?:        string | null
    synopsis?:    string | null
    hook?:        string | null
    genreId?:     string | null
  }
  autoSave?:      boolean
}

export type BookApiRelations = 'Chapter' | 'Chapters' | 'Character' | 'Gallery' | 'Genre'
type BookRelationsUpdate = {
  relation      : BookApiRelations
  genre?        : Genre
  chapter?      : Chapter
  chapters?     : Chapter[] 
  characters?   : Character[] 
  categories?   : BookCategory[] 
  cover?        : Image
}
