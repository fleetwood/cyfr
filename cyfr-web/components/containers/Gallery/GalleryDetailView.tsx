import { GalleryDetail } from './../../../prisma/prismaContext'
import GalleryCreateView from './GalleryCreateView'
import GalleryFooter from './GalleryFooter'

type GalleryDetailViewProps = {
    gallery:GalleryDetail
}

const GalleryItemView = ({gallery}:GalleryDetailViewProps) => {
    return (
        <div className='rounded-lg bg-base-300 text-base-content my-4'>
            <div className='min-w-full p-4 space-x-2 flex justify-around border-b-2 border-primary border-opacity-50'>
                <div>Likes ({gallery.likes.length})</div>
                <div>Shares ({gallery.shares.length})</div>
                <div>Images ({gallery.images.length})</div>
            </div>
            {gallery.description && (
                <div className='min-w-full p-4 bg-base-100'>{gallery.description}</div>
            )}
            <div className='min-w-full p-4 space-x-2'>
                <div className="columns-2 md:columns-3 lg:columns-4">
                    {gallery.images.map((image) => <img className='mb-4' src={image.url} />)}
                </div>
            </div>
            <div className='min-w-full'>
                <GalleryFooter gallery={gallery} feed={{type:'gallery'}} />
            </div>
        </div>
    )
}

export default GalleryItemView