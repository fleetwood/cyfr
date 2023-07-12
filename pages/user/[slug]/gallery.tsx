import GalleryCreateModal, { OpenGalleryModalButton } from "components/containers/Gallery/GalleryCreateModal"
import MainLayout from "components/layouts/MainLayout"
import {
  Gallery,
  GalleryStub,
  PrismaGallery, PrismaUser, UserDetail
} from "prisma/prismaContext"

import JsonBlock from "components/ui/jsonBlock"
import useDebug from "hooks/useDebug"
import { useCyfrUserApi } from "prisma/hooks/useCyfrUserApi"
import Spinner from "components/ui/spinner"
import ErrorPage from "pages/404"
import GalleryDetailView from "components/containers/Gallery/GalleryDetailView"
import GalleryStubView from "components/containers/Gallery/GalleryStubView"

const {debug, jsonBlock} = useDebug('pages/user/id/gallery','DEBUG')

export async function getServerSideProps(context: any) {
  const {slug} = context.params
  const user = await PrismaUser.detail({slug})
  const galleries = user ? await PrismaGallery.userGalleries(user.id) : []

  if (user) {
    debug('getServerSideProps', {...context.params, slug, name: user.name, galleries: galleries.length})
  }

  return {
    props: {
      galleries,
      user,
    },
  }
}

type UserGalleryPageProps = {
  user: UserDetail
  galleries: GalleryStub[]
}

const UserGalleryPage = ({ user, galleries }:UserGalleryPageProps) => {
  const {cyfrUser, isLoading, error} = useCyfrUserApi()

  return (
  <MainLayout sectionTitle="Galleries" subTitle={user?.name || ""}>
    <div className="flex flex-col space-y-4">
      {isLoading && <Spinner  size="md" />}
      {error && <ErrorPage message="Could not load galleries..." />}
      {cyfrUser?.id === user?.id && 
        <>
          <OpenGalleryModalButton />
          <GalleryCreateModal  />
        </>
      }
      {galleries && galleries.map((gallery:GalleryStub) => (
        <div className="relative" key={`user:${user?.id}-gallery:${gallery.id}`}>
          <GalleryStubView gallery={gallery} />
        </div>
      ))}
      
    </div>
  </MainLayout>
)}

export default UserGalleryPage
