import { ImageFeed, ImageStub, ImageViewProps } from '../../../prisma/prismaContext';

const ImageFeedView = ({ item, className, onClick }: ImageViewProps) => {
    const {image} = item
  const handleClick = (image: ImageStub) =>
    onClick ? onClick(image) : () => {}

  return (
    <div className={`relative rounded-lg overflow-clip ${className}`}>
        <div className="font-semibold">Image</div>
        {image && 
        <>
        {image.title &&
            <p className="absolute w-full top-0 font-semibold">{image.title}</p>
        }
        <img className="
            rounded-lg drop-shadow-md cursor-pointer 
            transition-all duration-100 ease-linear 
            scale-95 opacity-80 
            hover:scale-100 hover:opacity-100 hover:drop-shadow-xl"
            src={image.url}
            onClick={handleClick(image)}
            />
        <div className="absolute w-full bottom-2 p-4 bg-primary bg-opacity-50">
            <span className="float-right">Likes {image.likes?.length || 0}</span>
            <span className="float-right">Shares{image.shares?.length || 0}</span>
        </div>
        </>
        }
    </div>
)}
export default ImageFeedView
