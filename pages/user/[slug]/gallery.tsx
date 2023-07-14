import GalleryCreateModal, { OpenGalleryModalButton } from "components/containers/Gallery/GalleryCreateModal"
import MainLayout from "components/layouts/MainLayout"
import {
  GalleryStub,
  PrismaUser, UserDetail
} from "prisma/prismaContext"

import GalleryStubView from "components/containers/Gallery/GalleryStubView"
import Spinner from "components/ui/spinner"
import useDebug from "hooks/useDebug"
import ErrorPage from "pages/404"
import { useCyfrUserApi } from "prisma/hooks/useCyfrUserApi"
import useGalleryApi from "prisma/hooks/useGalleryApi"
import useRocketQuery from "hooks/useRocketQuery"
import { uniqueKey } from "utils/helpers"

const {debug, jsonBlock} = useDebug('user/[slug]/gallery','DEBUG')

export async function getServerSideProps(context: any) {
  const {slug} = context.params
  const user = await PrismaUser.detail({slug})

  return {
    props: {
      user,
      slug
    },
  }
}

type UserGalleryPageProps = {
  user: UserDetail
  slug: string
}

const UserGalleryPage = ({ user, slug }:UserGalleryPageProps) => {
  const {cyfrUser, isLoading:userLoading, error:userError} = useCyfrUserApi()
  const {data, isLoading, error, invalidate} = useRocketQuery<GalleryStub[]>({
    name: [`userGalleries-${slug}`],
    url: `/user/${slug}/galleries`
  })

  return (
  <MainLayout sectionTitle="Galleries" subTitle={user?.name || ""}>
    <div className="flex flex-col space-y-4">
      {cyfrUser?.id === user?.id && 
        <>
          <OpenGalleryModalButton />
          <GalleryCreateModal  />
        </>
      }
      {isLoading && <Spinner  size="md" />}
      {error && <ErrorPage message="Could not load galleries..." />}
      {data && data.map((gallery:GalleryStub) => (
        <div className="relative" key={uniqueKey(user, gallery)}>
          <GalleryStubView gallery={gallery} key={gallery.id}/>
        </div>
      ))}
      
    </div>
  </MainLayout>
)}

export default UserGalleryPage
