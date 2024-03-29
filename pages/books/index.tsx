import { useEffect, useState } from "react";
import BookCover from "components/containers/Books/BookCover";
import TailwindInput from "components/forms/TailwindInput";
import MainLayout from 'components/layouts/MainLayout';
import EZButton from "components/ui/ezButton";
import useDebug from "hooks/useDebug";
import { BookStub, GenreStub, PrismaBook, PrismaGenre } from 'prisma/prismaContext';
import { domRef } from "utils/helpers";

const {debug, jsonBlock} = useDebug('books/index', )

export async function getServerSideProps(context: any) {
    const genres = await PrismaGenre.stubs()
    const books = await PrismaBook.stubs()
    return {
      props: {
        genres,
        books
      },
    }
  }

type BooksPageProps = {
    genres: GenreStub[]
    books:  BookStub[]
}

const BooksPage = ({genres, books}: BooksPageProps) => {
  const [search, setSearch] = useState<string|null>(null)
  const [visibleGenres, setVisibleGenres] = useState<GenreStub[]>(genres)
  const [visibleBooks, setVisibleBooks] = useState<BookStub[]>([]) //(genres.flatMap(g => {return [...g.books]}))

  useEffect(() => {
    //todo: search by genre, title or author
    const set = search !== null && search!.trim().length > 0 
    ? genres.filter(g => g.title.toLowerCase().indexOf(search.toLowerCase())>=0)
    : genres
    setVisibleGenres(() => set)
    // setVisibleBooks(() => set
    //   .flatMap(g => {return [...g.books]})
    //   .filter(b => b !== null)
    //   .sort((a,b) => a.updatedAt > b.updatedAt ? 1 : -1)
    //   .slice(0,50)
    // )
  }, [search])

  return (
    <MainLayout pageTitle="Books!" sectionTitle="Books!">
        <div className="p-2 relative">
          {search !== null && search.length > 0 &&
            <label className="btn btn-sm btn-circle absolute right-[48%] top-2" onClick={() => setSearch(() => null)}>✕</label>
          }
          <TailwindInput type="text" inputClassName="w-[50%]" placeholder="TODO: What are you interested in?" setValue={setSearch} value={search} />
          <div className="grid grid-cols-4 justify-between gap-2 py-4">
            {/* {genres.map((g:GenreStub) => (
              <EZButton label={`${g.title} (${g.books?.filter(b => b !== null).length})`} variant={visibleGenres.filter(v => v.id === g.id).length> 0 ? 'primary' : 'secondary'} key={domRef(g)} onClick={() => setSearch(() => g.title)}/>
            ))} */}
          </div>
          <div className="grid grid-cols-3 justify-between gap-2 py-4">
            {visibleBooks.filter(b => b !== null).map((book) => (
                <BookCover book={book} key={domRef(book)} />
            ))}
          </div>
        </div>
    </MainLayout>
  )
}

export default BooksPage
