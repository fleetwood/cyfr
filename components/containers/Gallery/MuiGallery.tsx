import {AppBar,Backdrop,Box,Button,Card,CardActionArea,CardContent,Dialog,DialogContent,DialogTitle,Grid,IconButton,Toolbar} from '@mui/material'
import {useSwipeable} from 'react-swipeable'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import {ImageStub,PostImage} from 'prisma/types'
import {MuiArrowLeftIcon, MuiCloseIcon} from 'components/ui/icons'
import {useState} from 'react'
import ImageFooter from '../Image/ImageFooter'
import AvatarPill from 'components/ui/avatar/avatarPill'

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  }
}

type MuiGalleryProps = {
  images:       (ImageStub|PostImage)[]
  invalidate?:  () => void
}

export default function MuiGallery({images, invalidate}:MuiGalleryProps) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState(-1)
  const currentImage = images[image]

  const toggleOpen = (n?:boolean) => {
    setOpen(() => n ?? !open)
  }

  const selectImage = (index:number) => {
    setImage(index)
    toggleOpen(true)
  }

  const prevImage = () => {
    setImage((i) => i == 0 ? images.length-1 : i-1 )
  }

  const nextImage = () => {
    setImage((i) => (i == images.length-1 ? 0 : i+1))
  }

  const swipes = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    onSwipedUp: () => toggleOpen(false),
    onSwipedDown: () => toggleOpen(false),
    // onTap: () => toggleOpen(false),
    trackMouse: true,
    trackTouch: true
  })
  return (
    <>
      {currentImage && (
        <Backdrop
          open={open}
          sx={{
            color: '#333333',
            zIndex: 10000,
          }}
          {...swipes}
        >
          <Grid
            container
            direction="row"
            className="mt-4"
            justifyContent="center"
            {...swipes}
          >
            <Grid
              item
              xs={1}
              onClickCapture={() => prevImage()}
              className="text-base-200 cursor-pointer 
            hover:text-base-100 hover:bg-black hover:bg-opacity-40 
            transition-all duration-200"
            >
              <MuiArrowLeftIcon />
            </Grid>

            <Grid item justifyContent={'center'}>
              <Grid container direction="column">
                <Grid
                  item
                  xs
                  className="bg-black bg-opacity-40 text-base-100 p-2"
                >
                  <Grid container direction="row">
                    <Grid item xs>
                      <AvatarPill
                        user={currentImage.creator}
                        direction="left"
                      />
                    </Grid>
                    <Grid item flexGrow={1} />
                    <Grid item xs={1}>
                      <IconButton
                        className="btn btn-sm btn-circle float-right"
                        onClick={() => toggleOpen(false)}
                      >
                        <MuiCloseIcon className="text-base-100" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item flexGrow={1} className="relative max-h-fit">
                  <img
                    src={currentImage?.url}
                    loading="lazy"
                    className="m-auto max-h-fit"
                  />
                </Grid>
                <Grid
                  item
                  xs
                  className="bg-base-200 text-base-100"
                >
                  <ImageFooter image={currentImage} onUpdate={invalidate} />
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={1}
              alignItems="center"
              onClickCapture={() => nextImage()}
              className="text-base-200 cursor-pointer 
              hover:text-base-100 hover:bg-black hover:bg-opacity-40
              transit ion-all duration-200"
            >
              <MuiArrowLeftIcon className="rotate-180" />
            </Grid>
          </Grid>
        </Backdrop>
      )}
      <ImageList sx={{}} variant="quilted" cols={3} rowHeight={220}>
        {images.map((image, idx) => (
          <ImageListItem key={image.id} cols={1} rows={1}>
            <Card>
              <CardActionArea onClick={() => selectImage(idx)}>
                <CardContent>
                  <img {...srcset(image.url, 120, 1, 1)} loading="lazy" />
                </CardContent>
              </CardActionArea>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </>
  )}

