import GalleryCreateModal from "../../../components/containers/Gallery/GalleryCreateModal";
import GalleryDetailView from "../../../components/containers/Gallery/GalleryDetailView";
import MainLayout from "../../../components/layouts/MainLayout";
import {
  GalleryDetail,
  PrismaGallery, PrismaUser
} from "../../../prisma/prismaContext";

import { InferGetServerSidePropsType } from "next";
import { useCyfrUserContext } from "../../../components/context/CyfrUserProvider";

export async function getServerSideProps(context: any) {
  const user = await PrismaUser.userInSessionContext(context);
  const galleries = user ? await PrismaGallery.userGalleries(context.query.id) : []

  return {
    props: {
      galleries,
      user,
    },
  };
}

const UserGalleryPage = ({ user, galleries }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [cyfrUser] = useCyfrUserContext()

  return (
  <MainLayout sectionTitle="Galleries" subTitle={user?.name || ""}>
    <div className="flex flex-col space-y-4">
      {cyfrUser && cyfrUser.id === user?.id && 
        <GalleryCreateModal  />
      }
      {galleries.map((gallery:GalleryDetail) => (
        <div className="relative" key={`user:${user?.id}-gallery:${gallery.id}`}>
          <GalleryDetailView gallery={gallery} />
        </div>
      ))}
    </div>
  </MainLayout>
)};

export default UserGalleryPage;
