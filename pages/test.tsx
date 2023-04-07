import {Image} from './../prisma/prismaContext'
import Dropzone from "../components/forms/Dropzone"
import AdminLayout from "../components/layouts/AdminLayout"
import useDebug from "../hooks/useDebug"

const {debug, info, fileMethod} = useDebug('test','DEBUG')

const Test = ({}) => {
  const onComplete = (image:Image) => {
    debug('onComplete', {image})
  }

  return (
    <AdminLayout sectionTitle="Image Upsert" >
      <Dropzone limit={5} onUploadComplete={onComplete} />
    </AdminLayout>
  )
}

export default Test