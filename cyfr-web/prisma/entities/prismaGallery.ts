import { log } from "../../utils/log";
import { Gallery, GalleryDetail, Like } from "../types";
import {
  GalleryDetailInclude,
  GalleryEngageProps,
  GalleryFeed,
  GalleryFeedInclude,
} from "../types/gallery.def";

const fileName = "prismaGallery";
const fileMethod = (method: string) => `${fileName}.${method}`;
const trace = (method: string, t?: any) =>
  log(fileMethod(method) + t ? " " + JSON.stringify(t, null, 2) : "");

export type GalleryAddImageProps = {
  id: string;
  images: {
    url: string;
    authorId: string;
  }[];
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
  trace("getDetail", { galleryId });
  try {
    const result = await prisma.gallery.findUnique({
      where: { id: galleryId },
      include: GalleryDetailInclude,
    });
    if (result) return result as unknown as GalleryDetail;
    throw { code: fileMethod, message: "Unable to find a gallery by that key" };
  } catch (error) {
    trace(`getDetail ERROR`, error);
    throw error;
  }
};

const like = async ({
  galleryId,
  authorId,
}: GalleryEngageProps): Promise<Like> => {
  trace(`like`, { galleryId, authorId });
  throw { code: fileMethod, message: "Feature not implemented" };
};

const share = async ({
  galleryId,
  authorId,
}: GalleryEngageProps): Promise<Like> => {
  trace(`share`, { galleryId, authorId });
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
  trace("addImage", { id, ...props });
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
    trace(`\taddImage ERROR`, error);
  }
};

type CreateGalleryProps = {
  authorId: string;
  title?: string;
  description?: string;
  images?: string[];
};

const createGallery = async ({
  authorId,
  title,
  description,
  images,
}: CreateGalleryProps) => {
  try {
    trace(`createGallery`, { authorId, title, description, images });
    const data = images ?
      {
        authorId,
        title,
        description,
        images: {
          createMany: {
            data: images?.map(url => {return {authorId,url}})
          }
        }
      }
      :
      {
        authorId,
        title,
        description,
      }
    trace(`createGallery`, data)
    const result = await prisma.gallery.create({data})

    if (result) {
      return result;
    }
    throw { code: fileMethod, message: "Unable to create gallery" };
  } catch (error) {
    trace(`\tcreateGallery ERROR`, error);
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
