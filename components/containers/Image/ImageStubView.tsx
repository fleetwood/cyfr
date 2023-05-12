import { ImageStubViewProps } from "../../../prisma/prismaContext"

const ImageStubView = ({ image, className }:ImageStubViewProps) => {

  return(
  <div className={`relative rounded-lg overflow-clip ${className} image-preview`}>
      {image && 
      <>
        <img className="rounded-lg drop-shadow-md" src={image.url} />

        {image.title &&
          <div className="image-header">
            <span>{image.title}</span>
          </div>
        }
        <div className="image-footer">
           {/* @ts-ignore */}
          {image.likes !== undefined &&
           // @ts-ignore
            <span>Likes {image.likes.length || 0}</span>
          }
          {/* @ts-ignore */}
          {image.shares !== undefined &&
            // @ts-ignore
            <span>Shares {image.shares.length || 0}</span>
          }
        </div>
      </>
      }
  </div>
)}
export default ImageStubView