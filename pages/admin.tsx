import Link from "next/link"
import { useEffect, useState } from "react"
import GenreAdmin from "../components/containers/Genre/GenreAdmin"
import AdminLayout from "../components/layouts/AdminLayout"
import { CyfrLogo } from "../components/ui/icons"
import useDebug from "../hooks/useDebug"
import { useSession } from "../lib/next-auth-react-query"

import { GenreStub } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import { uniqueKey } from "../utils/helpers"

const { debug, jsonBlock } = useDebug("admin page", 'DEBUG')

const AdminPage = ({}) => {
  useSession({ required: true, redirectTo: "/" })
  const [genres, setGenres] = useState<Array<GenreStub>>([])
  const [editGenre, setEditGenre] = useState<GenreStub|null>(null)
  
  const CyfrHome = (
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" />
      <div>Cyfr Admin</div>
    </div>
  )

  useEffect(() => {
    const getGenres = async () => {
      const genreList = await getApi('genre/stubs')
      if (genreList.result) {
        debug('getGenres', genreList.result)
        setGenres(() => genreList.result)
      }
    }
    getGenres()
  }, [])

  return (
    <AdminLayout sectionTitle={CyfrHome}>
      <div>
        <Link href="/"><h2 className="h-subtitle">Home</h2></Link>
      </div>
      <div>
        <h2 className="h-title">Dashboard</h2>
      </div>
      <div>
        <h2 className="h-subtitle">Genres</h2>
        <div className="flex flex-wrap justify-items-center">
          {genres.length>0 && genres.map(genre => 
            <div 
              key={uniqueKey(genre)} 
              className='btn btn-primary text-primary-content rounded-md px-2 mr-2 mb-2 sm:w-1/3 md:w-1/6' 
              onClick={() => setEditGenre(genre)}>
              {genre.title}
            </div>)}
            {jsonBlock(genres)}
        </div>
        <GenreAdmin editGenre={editGenre} />
      </div>
    </AdminLayout>
  )
}

export default AdminPage
