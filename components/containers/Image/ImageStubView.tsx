import { ImageStubViewProps } from "prisma/prismaContext"
import ImageFooter from "./ImageFooter"

const ImageStubView = ({ image, className }:ImageStubViewProps) => {

  return(
  <div className={`relative rounded-lg overflow-clip ${className} image-preview`}>
      {image && 
      <>
        <img className="rounded-lg drop-shadow-md" src={image.url} />
        {image.title &&
          <div className="image-header">
            {image.title}
          </div>
        }
        <div className="image-footer w-full">
          <ImageFooter image={image} />
        </div>
      </>
      }
  </div>
)}
export default ImageStubView