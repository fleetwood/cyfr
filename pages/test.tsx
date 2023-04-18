import {Image} from './../prisma/prismaContext'
import Dropzone from "../components/forms/Dropzone"
import AdminLayout from "../components/layouts/AdminLayout"
import useDebug from "../hooks/useDebug"
import GalleryUpsertForm from '../components/containers/Gallery/GalleryUpsertForm'

const {debug, info, fileMethod} = useDebug('test','DEBUG')

const Test = ({}) => {
  const onComplete = (images:[]) => {
    debug('onComplete', {images})
  }

  return (
    <AdminLayout sectionTitle="Image Upsert" >
      <GalleryUpsertForm limit={10} variant={'no-description'} />
    </AdminLayout>
  )
}

export default Test