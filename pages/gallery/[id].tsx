import { Spinner } from "@material-tailwind/react"
import GalleryDetailView from "components/containers/Gallery/GalleryDetailView"
import MainLayout from "components/layouts/MainLayout"
import useGalleryQuery from "hooks/useGalleryQuery"
import { useRouter } from "next/router"
import ErrorPage from "pages/404"
import { PrismaGallery } from "prisma/entities/prismaGallery"
import { GalleryDetail } from "prisma/types"

export async function getServerSideProps(context: any) {
  const galleryId = context.params.id
  const gallery = await PrismaGallery.detail(galleryId)

  return {
    props: {
      gallery,
    },
  }
}

type GalleryDetailPageProps = {
  gallery: GalleryDetail
}

const GalleryDetailPage = () => {
  const router = useRouter()
  const { id } = router?.query
  
  const {data, isLoading, error} = useGalleryQuery(id! as string)

  const gallery = data
  const authorName = gallery?.author?.name ? `by ${gallery?.author?.name}` :``

  return (
    <MainLayout
      sectionTitle={gallery?.title || "Gallery"}
      subTitle={authorName}
    >
      {error && <ErrorPage />}
      {isLoading && <Spinner onResize={undefined} onResizeCapture={undefined} />}
      {gallery && <GalleryDetailView gallery={gallery} />}
    </MainLayout>
  )
}

export default GalleryDetailPage
