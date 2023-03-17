import GalleryCreateView from "../../../components/containers/Gallery/GalleryCreateView";
import GalleryDetailView from "../../../components/containers/Gallery/GalleryDetailView";
import MainLayout from "../../../components/layouts/MainLayout";
import {
  PrismaGallery, PrismaUser
} from "../../../prisma/prismaContext";

import { InferGetServerSidePropsType } from "next";
import { useCyfrUserContext } from "../../../components/context/CyfrUserProvider";

export async function getServerSideProps(context: any) {
  const authorId = context.params.id;
  const user = await PrismaUser.byNameOrId(authorId);
  const galleries = user ? await PrismaGallery.userGalleries(user.id) : []

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
        <GalleryCreateView  />
      }
      {galleries.map((gallery) => (
        <div className="relative" key={`user:${user?.id}-gallery:${gallery.id}`}>
          <GalleryDetailView gallery={gallery} />
        </div>
      ))}
    </div>
  </MainLayout>
)};

export default UserGalleryPage;
