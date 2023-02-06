import GalleryDetailView from "../../../components/containers/Gallery/GalleryDetailView"
import MainLayout from "../../../components/layouts/MainLayout"
import { PrismaGallery, GalleryDetail, PrismaUser, UserDetail } from "../../../prisma/prismaContext"

export async function getServerSideProps(context: any) {
    const authorId = context.params.id
    const user = await PrismaUser.byId(authorId)
    const galleries = await PrismaGallery.userGalleries(authorId)
  
    return {
      props: {
        galleries,
        user
      },
    }
  }

type UserGalleryPageProps = {
    galleries: GalleryDetail[]
    user: UserDetail
}

const UserGalleryPage = ({user, galleries}:UserGalleryPageProps) => {
    return (
    <MainLayout
        sectionTitle="Galleries"
        subTitle={user?.name || ''}>
        <div className="flex flex-col space-y-4">
        {galleries.map(gallery => 
            <div className="relative">
                <GalleryDetailView gallery={gallery} />
            </div>
        )}
        </div>
    </MainLayout>
)}

export default UserGalleryPage