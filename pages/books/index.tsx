import MainLayout from '../../components/layouts/MainLayout'
import { prisma, Genre } from '../../prisma/prismaContext'
import { InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: any) {
    const genres = await prisma.$queryRaw`SELECT * FROM f_genre_all()`
    return {
      props: {
        genres,
        books: []
      },
    }
  }

type BooksPageProps = {
    genres: any[],
    books: any[]
}

const BooksPage = ({genres, books}: BooksPageProps) => {
  return (
    <MainLayout pageTitle="Books!" sectionTitle="Books!">
        {genres.map((g:Genre) => (
            <div>
                <h2>{g.title}</h2>
            </div>
        ))}
    </MainLayout>
  )
}

export default BooksPage
