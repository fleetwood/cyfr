import { useEffect, useState } from "react"
import { cloudinary } from "../../../utils/cloudinary"
import { FileError } from "react-dropzone"
import Spinner from "../../ui/spinner"
import { CompleteFile, UploadFileViewProps } from "./types.defs"
import useDebug from "../../../hooks/useDebug"
const [debug] = useDebug("Dropzone/UploadingFileView")

const UploadFileView = ({file, onComplete}: UploadFileViewProps) => {
  const [fileProgress, setFileProgress] = useState<number>(0)
  const [fileErrors, setFileErrors] = useState<FileError[]>([])
  const [preview, setPreview] = useState<CompleteFile | null>(null)

  const progressStyle = (e: boolean, p: number) =>
    e ? "progress-error" : p < 100 ? "progress-info" : "progress-success"

  const onProgress = (p: number) => {
    setFileProgress(p)
  }

  const onFileComplete = (e:any) => {
    if (onComplete) onComplete(e)
  }

  useEffect(() => {
    async function upload() {
      const url = await cloudinary.upload({file: file.file, onProgress, onComplete: onFileComplete })
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
