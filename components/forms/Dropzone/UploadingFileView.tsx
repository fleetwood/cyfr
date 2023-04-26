import { useEffect, useState } from "react"
import { cloudinary } from "../../../utils/cloudinary"
import { FileError } from "react-dropzone"
import Spinner from "../../ui/spinner"
import { CompleteFile, UploadFileViewProps } from "./types.defs"
import useDebug from "../../../hooks/useDebug"
import { sendApi } from "../../../utils/api"
import { ImageUpsertProps, Image } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Link from "next/link"
const {debug} = useDebug("components/forms/Dropzone/UploadingFileView")

const UploadFileView = ({file, onUploadComplete, onUploadChange}: UploadFileViewProps) => {
  const [cyfrUser, loading] = useCyfrUserContext()
  const [fileProgress, setFileProgress] = useState<number>(0)
  const [fileErrors, setFileErrors] = useState<FileError[]>([])
  const [image, setImage] = useState<Image | null>(null)

  if (loading) return <Spinner />
  else if (!cyfrUser) return <>Please <Link href='/login'>login</Link> first...</>

  const progressStyle = (e: boolean, p: number) =>
    e ? "progress-error" : p < 100 ? "progress-info" : "progress-success"

  const onProgress = (p: number) => {
    setFileProgress(p)
  }

  /**
   * 
   * @param file: {@link CompleteFile} will need to be converted to {@link ImageUpsertProps}
   */
  const uploadComplete = async (file:CompleteFile) => {
    debug('uploadComplete', file)
    // convert completeFile to ImageUpsertProps
    const props = {
      authorId: cyfrUser.id,
      url: file.secure_url,
      visible: true,
      height: file.height,
      width: file.width,
      title: file.original_filename
    }
    const image = await(await sendApi('image/upsert', props)).data.result
    if (image) {
      debug('uploadComplete.image', image)
      setImage(image)
      if (onUploadComplete) onUploadComplete(image)
    }else{
      debug('uploadComplete image upsert failed')
    }
  }

  const removeFile = (file:Image) => {
    debug('removeFile', file)
    file.visible = false
    if (onUploadChange) {
      onUploadChange(file)
    }
  }

  const unRemoveFile = (file:Image) => {
    debug('removeFile', file)
    file.visible = true
    if (onUploadChange) {
      onUploadChange(file)
    }
  }

  useEffect(() => {
    cloudinary.upload({file: file.file, onProgress, onComplete: uploadComplete })
  }, [])

  const RemoveButton = ({img}:{img:Image}) => {
    const {visible} = img;
    return visible 
    ? <label className="btn btn-sm btn-circle bg-warning absolute right-0 top-0" onClick={() => removeFile(img)}>✕</label>
    : <label className="btn btn-sm btn-circle bg-success absolute right-0 top-0" onClick={() => unRemoveFile(img)}>+</label>
  }

  return (
    <div className="relative mb-2 h-32" key={file.id}>
      {image && 
        <div>
            <img src={image.url} className={`mask mask-squircle max-h-32 h-32 ${image.visible ? '' : 'opacity-30'}`} />
            <div className="bg-success text-success-content overflow-hidden text-xs opacity-80 absolute bottom-6 mx-2 px-2 rounded-md">{image.title}</div>
            <RemoveButton img={image} />
        </div>
      }
      {!image && fileErrors.length < 1 && <Spinner />}
      <progress
        className={`progress h-2 px-2 absolute bottom-2 z-2 opacity-80 drop-shadow-md ${progressStyle(
          fileErrors.length > 0,
          fileProgress
        )}`}
        value={fileProgress}
        max="100"
      />
      {fileErrors.map((e) => (
        <div>{e.message}</div>
      ))}
    </div>
  )
}

export default UploadFileView
