import { ImageStub } from "prisma/prismaContext"
import ImageFooter from "./ImageFooter"

export type ImageStubViewProps = {
  image:      ImageStub
  onClick?:   (image: ImageStub) => any
  className?: string
  footer?:    boolean
  header?:    boolean
}

const ImageStubView = ({ image, className, header=true, footer=true }:ImageStubViewProps) => (
  <div className={`relative rounded-lg overflow-hidden ${className} image-preview`}>
    {header && <img className="rounded-lg drop-shadow-md" src={image.url} />}
    {image.title && <div className="image-header">{image.title}</div>}
    {footer && <div className="image-footer w-full"><ImageFooter image={image} /></div>}
  </div>
)
export default ImageStubView