import useDebug from "../../hooks/useDebug";
import { GalleryCreateProps, GalleryDetail, GalleryEngageProps, GalleryFeed, GalleryFeedInclude, ImageCreateProps, Like, Share } from "../prismaContext";

const {debug, info, fileMethod} = useDebug('entities/prismaGallery', 'DEBUG')

export type GalleryAddImageProps = {
  id: string;
  images: ImageCreateProps[];
};

const userGalleries = async (authorId: string): Promise<any> => {
  try {
    debug('userGalleries', {authorId})
    const result = await prisma.$queryRaw`select * from f_user_galleries(${authorId})`
    if (result) {
      debug('got some gallerieesesses', {result})
      return result
    }
    throw {code: fileMethod, message: 'Could not find galleries for that user id'}
  } catch (error) {
    throw error
  }
}

const getDetail = async (galleryId: string): Promise<GalleryDetail> => {
  debug("getDetail", { galleryId });
  try {
    const result:any[] = await prisma.$queryRaw`SELECT * FROM f_gallery_detail(${galleryId})`
    if (result[0]) return result[0] as GalleryDetail;
    throw { code: fileMethod, message: "Unable to find a gallery by that key" };
  } catch (error) {
    info(`getDetail ERROR`, error);
    throw error;
  }
};

const like = async ({
  galleryId,
  authorId,
}: GalleryEngageProps): Promise<Like> => {
  debug(`like`, { galleryId, authorId });
  throw { code: fileMethod, message: "Feature not implemented" };
};

const share = async ({
  galleryId,
  authorId,
}: GalleryEngageProps): Promise<Share> => {
  debug(`share`, { galleryId, authorId });
  const share = await prisma.share.create({
    data: {
      authorId,
      galleryId
    }
  })
  if (share) {
    return share
  }
  throw { code: fileMethod, message: "Feature not implemented" };
};

const all = async (): Promise<GalleryFeed[]> => {
  try {
    const g = await prisma.gallery.findMany({
      where: {
        visible: true,
      },
      include: GalleryFeedInclude,
      orderBy: {
        updatedAt: "desc",
      },
    });
    if (g) return g;
    throw { code: fileMethod, message: "Unable to obtain all galleries!!!" };
  } catch (error) {
    throw error;
  }
};

const addImages = async ({ id, ...props }: GalleryAddImageProps) => {
  debug("addImage", { id, ...props });
  try {
    const result = await prisma.gallery.update({
      where: {
        id,
      },
      data: {
        images: {
          createMany: {
            data: [...props.images],
          },
        },
      },
    });
    if (result) return result;
  } catch (error) {
    info(`addImage ERROR`, error);
  }
};

const createGallery = async ({
  authorId,
  title,
  description,
  images,
}: GalleryCreateProps) => {
  try {
    // debug(`createGallery`, { authorId, title, description, images });
    const data = images ?
      {
        authorId,
        title,
        description,
        images: {
          createMany: {
            data: images
          }
        }
      }
      :
      {
        authorId,
        title,
        description,
      }
    debug(`createGallery`, data)
    const result = await prisma.gallery.create({data})

    if (result) {
      return result;
    }
    throw { code: fileMethod, message: "Unable to create gallery" };
  } catch (error) {
    info(`createGallery ERROR`, error);
  }
};
export const PrismaGallery = {
  addImages,
  createGallery,
  getDetail,
  like,
  share,
  all,
  userGalleries
};
