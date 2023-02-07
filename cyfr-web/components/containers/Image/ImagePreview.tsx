import { ImageViewProps } from "../../../prisma/prismaContext"

const ImagePreview = ({ image, className }:ImageViewProps) => 
  <div className={`relative rounded-lg overflow-clip ${className} image-preview`}>
      {image && 
      <>
        <img className="
            rounded-lg drop-shadow-md"
            src={image.url}
            />

        {image.title &&
          <div className="image-header">
            <span>{image.title}</span>
          </div>
        }
        <div className="image-footer">
            <span>ID {image.id}</span>
            <span>Likes {image.likes?.length || 0}</span>
            <span>Shares{image.shares?.length || 0}</span>
        </div>
      </>
      }
  </div>

export default ImagePreview