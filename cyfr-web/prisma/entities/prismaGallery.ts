import useDebug from "../../hooks/useDebug";
import { Gallery, GalleryDetail, ImageCreateProps, Like } from "../types";
import { GalleryCreateProps } from '../types/gallery.def';
import {
  GalleryDetailInclude,
  GalleryEngageProps,
  GalleryFeed,
  GalleryFeedInclude,
} from "../types/gallery.def";
const [debug, warn, fileMethod] = useDebug('entities/prismaGallery')

export type GalleryAddImageProps = {
  id: string;
  images: ImageCreateProps[];
};

const userGalleries = async (authorId: string): Promise<GalleryDetail[]> => {
  try {
    const result = await prisma.gallery.findMany({
      where: {
        authorId,
        visible:true
      },
      include: GalleryDetailInclude,
      orderBy: {
        updatedAt: 'desc'
      }
    })
    if (result) {
      return result as unknown as GalleryDetail[]
    }
    throw {code: fileMethod, message: 'Could not find galleries for that user id'}
  } catch (error) {
    throw error
  }
}

const getDetail = async (galleryId: string): Promise<GalleryDetail> => {
  debug("getDetail", { galleryId });
  try {
    const result = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: GalleryDetailInclude,
    });
    if (result) return result as unknown as GalleryDetail;
    throw { code: fileMethod, message: "Unable to find a gallery by that key" };
  } catch (error) {
    warn(`getDetail ERROR`, error);
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
}: GalleryEngageProps): Promise<Like> => {
  debug(`share`, { galleryId, authorId });
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
    warn(`addImage ERROR`, error);
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
    warn(`createGallery ERROR`, error);
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
