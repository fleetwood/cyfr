// @ts-nocheck
import "photoswipe/dist/photoswipe.css";

import { Gallery, Item } from "react-photoswipe-gallery";
import { uniqueKey } from "../../../utils/helpers";

type GalleryPhotoswipeProps = {
  items: ItemProps[];
};

const GalleryPhotoswipe = ({items}:GalleryPhotoswipeProps) => {
//   const smallItemStyles: React.CSSProperties = {
//     cursor: "pointer",
//     objectFit: "cover",
//     width: "100%",
//     maxHeight: "100%",
//   };
  return (
    <Gallery>
    <div className="min-w-full">
      <div className="columns-2 md:columns-4 lg:columns-6 space-y-1 justify-evenly">
        {items.map(item => (
            <Item {...item} key={uniqueKey(item)}>
            {({ ref, open }) => (
                <img className="cursor-pointer rounded-md transition-all duration-200 ease-out opacity-80 scale-90 hover:opacity-100 hover:scale-100"
                    src={item.original}
                    ref={ref as React.MutableRefObject<HTMLImageElement>}
                    onClick={open}
                />
            )}
            </Item>
        ))}
      </div>
      </div>
    </Gallery>
  );
};

export default GalleryPhotoswipe;
