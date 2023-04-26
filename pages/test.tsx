import {Image} from './../prisma/prismaContext'
import Dropzone from "../components/forms/Dropzone"
import AdminLayout from "../components/layouts/AdminLayout"
import useDebug from "../hooks/useDebug"
import GalleryUpsertForm from '../components/containers/Gallery/GalleryUpsertForm'
import { InlineTextarea } from '../components/forms'
import { useState } from 'react'

const {debug, info, fileMethod} = useDebug('test','DEBUG')

const Test = ({}) => {
  const [content, setContent] = useState<string>()

  const onSave = () => {
    debug('onSave')
  }

  return (
    <AdminLayout sectionTitle="InlineTextArea" >
      <InlineTextarea content={content} setContent={setContent} onSave={onSave} />
    </AdminLayout>
  )
}

export default Test