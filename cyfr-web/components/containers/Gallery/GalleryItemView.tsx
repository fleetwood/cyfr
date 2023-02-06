import Link from 'next/link'
import {Gallery, GalleryItem} from './../../../prisma/prismaContext'

type GalleryItemViewProps = {
    gallery:GalleryItem
}

const GalleryItemView = ({gallery}:GalleryItemViewProps) => {
    return (
        <>
        <div>
            <Link href={`/gallery/${gallery.id}`}><h2 className="h-subtitle">{gallery.title}</h2></Link>
            <div>
                <div>Likes ({gallery._count.likes})</div>
                <div>Shares ({gallery._count.shares})</div>
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