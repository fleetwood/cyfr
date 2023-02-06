import { GalleryDetail, Gallery, GalleryItem} from './../../../prisma/prismaContext'

type GalleryDetailViewProps = {
    gallery:GalleryDetail
}

const GalleryItemView = ({gallery}:GalleryDetailViewProps) => {
    return (
        <>
        <div>
            <div>
                <div>Id ({gallery.id})</div>
                <div>Likes ({gallery.likes.length})</div>
                <div>Shares ({gallery.shares.length})</div>
                <div>Images ({gallery.images.length})</div>
            </div>
        </div>
        <div className="columns-2 md:columns-3 lg:columns-4">
            {gallery.images.map((image) => 
                <img className='mb-4' src={image.url} />
            )}
        </div>
        </>
    )
}

export default GalleryItemView