import GalleryCreateModal from "../../../components/containers/Gallery/GalleryCreateModal"
import MainLayout from "../../../components/layouts/MainLayout"
import {
  Gallery,
  PrismaGallery, PrismaUser
} from "../../../prisma/prismaContext"

import { InferGetServerSidePropsType } from "next"
import { useCyfrUserContext } from "../../../components/context/CyfrUserProvider"
import useDebug from "../../../hooks/useDebug"
import JsonBlock from "../../../components/ui/jsonBlock"

const {jsonBlock} = useDebug('pages/user/id/gallery', 'DEBUG')

export async function getServerSideProps(context: any) {
  const user = await PrismaUser.userInSessionContext(context)
  const galleries = user ? await PrismaGallery.userGalleries(user.id) : []

  return {
    props: {
      galleries,
      user,
    },
  }
}

const UserGalleryPage = ({ user, galleries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [cyfrUser] = useCyfrUserContext()

  return (
  <MainLayout sectionTitle="Galleries" subTitle={user?.name || ""}>
    <div className="flex flex-col space-y-4">
      {cyfrUser && cyfrUser.id === user?.id && 
        <GalleryCreateModal  />
      }
        {/* <div className="relative" key={`user:${user?.id}-gallery:${gallery.id}`}>
          <GalleryDetailView gallery={gallery} />
        </div> */}
      {galleries.map((gallery:Gallery) => (
          <JsonBlock data={gallery} />
      ))}
    </div>
  </MainLayout>
)}

export default UserGalleryPage
