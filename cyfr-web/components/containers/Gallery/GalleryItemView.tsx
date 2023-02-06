import Link from 'next/link'
import {GalleryFeed} from './../../../prisma/prismaContext'

type GalleryItemViewProps = {
    gallery:GalleryFeed
}

const GalleryItemView = ({gallery}:GalleryItemViewProps) => {
    return (
        <>
        <div>
            <Link href={`/gallery/${gallery.id}`}><h2 className="h-subtitle">{gallery.title}</h2></Link>
            <div>
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