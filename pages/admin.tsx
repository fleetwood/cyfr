import Link from "next/link"
import { useEffect, useState } from "react"
import GenreAdmin from "../components/containers/Genre/GenreAdmin"
import { useCyfrUserContext } from "../components/context/CyfrUserProvider"
import AdminLayout from "../components/layouts/AdminLayout"
import AllowContent from "../components/ui/allowContent"
import { CyfrLogo } from "../components/ui/icons"
import useDebug from "../hooks/useDebug"
import { useSession } from "../lib/next-auth-react-query"
import { GenreListItem } from "../prisma/types"
import { getApi } from "../utils/api"
import { uniqueKey } from "../utils/helpers"

const { debug } = useDebug("admin page", "DEBUG")

const AdminPage = ({}) => {
  useSession({ required: true, redirectTo: "/" })
  const [cyfrUser, loading] = useCyfrUserContext()
  const [genres, setGenres] = useState<Array<GenreListItem>>([])
  const [editGenre, setEditGenre] = useState<GenreListItem|null>(null)
  
  const CyfrHome = (
    <div className="flex">
      <CyfrLogo className="animate-pulse text-primary w-[3.75rem] mt-2" />
      <div>Cyfr Admin</div>
    </div>
  )

  useEffect(() => {
    const getGenres = async () => {
      const result = await getApi('genre/list')
      if (result) {
        setGenres(() => result)
      }
    }
  }, [loading])

  return (
      <AllowContent cyfrUser={cyfrUser} required='owner' redirect='/'>
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
              {genres?.map(genre => 
                <div 
                  key={uniqueKey(genre)} 
                  className='btn btn-primary text-primary-content rounded-md px-2 mr-2 mb-2 sm:w-1/3 md:w-1/6' 
                  // @ts-ignore bc of stupid auto-replace InferServersideProps
                  onClick={() => setEditGenre(genre)}>
                  {genre.title}
                </div>)}
            </div>
            <GenreAdmin editGenre={editGenre} />
          </div>
        </AdminLayout>
      </AllowContent>
  )
}

export default AdminPage
