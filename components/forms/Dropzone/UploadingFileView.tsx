import { useEffect, useState } from "react"
import { cloudinary } from "../../../utils/cloudinary"
import { FileError } from "react-dropzone"
import Spinner from "../../ui/spinner"
import { CompleteFile, UploadFileViewProps } from "./types.defs"
import useDebug from "../../../hooks/useDebug"
import { sendApi } from "../../../utils/api"
import { ImageUpsertProps } from "../../../prisma/prismaContext"
import { useCyfrUserContext } from "../../context/CyfrUserProvider"
import Link from "next/link"
const {debug} = useDebug("components/forms/Dropzone/UploadingFileView")

const UploadFileView = ({file, onComplete}: UploadFileViewProps) => {
  const [cyfrUser, loading] = useCyfrUserContext()
  const [fileProgress, setFileProgress] = useState<number>(0)
  const [fileErrors, setFileErrors] = useState<FileError[]>([])
  const [preview, setPreview] = useState<CompleteFile | null>(null)

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
  const onUploadComplete = async (file:CompleteFile) => {
    debug('onUploadComplete', file)
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
      debug('onUploadComplete.image', image)
      if (onComplete) onComplete(image)
    }else{
      debug('onUploadComplete image upsert failed')
    }
  }

  const onFileComplete = (e:any) => {
    debug('onFileComplete', e)
    // if (onComplete) onComplete(e)
  }

  useEffect(() => {
    async function upload() {
      const url = await cloudinary.upload({file: file.file, onProgress, onComplete: onUploadComplete })
      if (url) {
        // @ts-ignore
        const file = JSON.parse(url) as unknown as CompleteFile
        setPreview((c) => file)
      }
    }
    upload()
  }, [])

  return (
    <div className="relative mb-2" key={file.id}>
      {preview && 
        <div>
            <img src={preview.secure_url} className="mask mask-squircle" />
            <div className="bg-success text-success-content overflow-hidden text-xs opacity-80 absolute bottom-6 mx-2 px-2 rounded-md">{preview.original_filename+'.'+preview.format}</div>
        </div>}
      {!preview && fileErrors.length < 1 && <Spinner />}
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
