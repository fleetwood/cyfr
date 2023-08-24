import {ImageStub} from "prisma/prismaContext"
import {SizeProps} from "types/props"
import {CloudImageProps, cloudinary} from "utils/cloudinary"

export type CloudinaryImageProps = CloudImageProps & {
  image?:     ImageStub
  onClick?:   (image: ImageStub|undefined) => any
  className?: string
  variants?:  'thumb'|'resize'|'scale'|'avatar'|'banner'
  size?:      SizeProps
}

const CloudinaryImage = ({ image, className, onClick, variants, size, ...props }:CloudinaryImageProps) => {
  const imageProps = {...props, ...{url: image?.url ?? props.url}}
  const url = variants === 'banner' ? cloudinary.banner(imageProps) :
              variants === 'resize' ? cloudinary.resize(imageProps) :
              variants === 'scale'  ? cloudinary.scale(imageProps) :
              variants === 'avatar' ? cloudinary.avatar(image?.url ?? props.url, size!) :
              cloudinary.thumb(imageProps)
  return <img className={className} src={url} onClick={onClick ? () => onClick(image) : () => {}} />
}
export default CloudinaryImage