import { Gallery, Image } from "../prismaContext"

export type GalleryItem = Gallery & {
  images: Image[], 
  _count: { 
    likes: number, 
    shares: number
  }
}