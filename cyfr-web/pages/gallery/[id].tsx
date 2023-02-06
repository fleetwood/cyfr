import GalleryDetailView from "../../components/containers/Gallery/GalleryDetailView";
import MainLayout from "../../components/layouts/MainLayout";
import { PrismaGallery } from "../../prisma/entities/prismaGallery";
import { GalleryDetail } from "../../prisma/types";

export async function getServerSideProps(context: any) {
    const galleryId = context.params.id
    const gallery = await PrismaGallery.getDetail(galleryId)
  
    return {
      props: {
        gallery,
      },
    }
  }

type GalleryDetailPageProps= {
    gallery: GalleryDetail
}

const GalleryDetailPage = ({gallery}:GalleryDetailPageProps) => {
    return (
        <MainLayout 
            sectionTitle={gallery.title||'Gallery'}
            subTitle={gallery.author.name}
            >
            <GalleryDetailView gallery={gallery} />
        </MainLayout>
    )
}

export default GalleryDetailPage;
