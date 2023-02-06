import { ReactNode, useCallback, useEffect, useState } from "react"
import { Accept, FileError, FileRejection, useDropzone } from 'react-dropzone'
import { uuid } from "../../../utils/helpers"
import { log, todo } from "../../../utils/log"
import SingleFileUploadWithProgress from "./SingleFileUploadWithProgress"

const fileTypes = ["JPG", "PNG", "GIF"]

export interface UploadedFile {
  file: File
  errors: FileError[]
}

export type CompleteFile = {
  asset_id: string
  public_id:string
  version:number
  version_id:string
  signature:string
  width:number
  height:number
  format:string
  resource_type:string
  created_at:string // "2023-01-26T19:49:28Z"
  tags: [string]
  pages:number,
  bytes:number,
  type:string,
  etag:string,
  placeholder:boolean,
  url:string, //http
  secure_url:string, //https
  folder:string,
  access_mode:string,
  metadata:any,
  existing:boolean,
  original_filename:string
}

export type DropzoneProps = {
  limit?: number
  onFileCompleted?: Function
  children?: ReactNode
}

export interface UploadableFile {
  file: File
  id: string
  accepted: boolean
  errors: FileError[]
}

function Dropzone({limit=-1, onFileCompleted, children}:DropzoneProps) {
  const [files, setFiles] = useState<UploadableFile[]>([])
  const [rejected, setRejected] = useState<UploadableFile[]>([])
  const [completedFiles, setCompletedFiles] = useState<CompleteFile[]>([])
  
  const getLimit = (a:any[]) => limit>0?limit:a.length

  const onDrop = useCallback((acceptedFiles:File[], rejectedFiles:FileRejection[]) => {
    log(`version2.onDrop(
      ${JSON.stringify({acceptedFiles, rejectedFiles}, null, 2)}
      )`)
      const mapAccepted = acceptedFiles.slice(0, getLimit(acceptedFiles)).map(file => ({file, accepted: true, errors: [], id: uuid()}))
      const mapRejected = [
        ...acceptedFiles.slice(getLimit(acceptedFiles)).map(file => ({file, accepted: true, errors: [{code: 'limit', message: `Exceed allowed limit (${limit})`}], id: uuid()})),
        ...rejectedFiles.map(file => ({...file, accepted: false, id: uuid()}))
      ]
      setFiles((f) => [...f, ...mapAccepted])
      setRejected((f) => [...f, ...mapRejected])
  }, [])

  const onFileComplete = useCallback((e:any) => {
    log(`version2.onFileComplete ${JSON.stringify(e.original_filename+'.'+e.format)}`)
    setCompletedFiles((current) => [...current, e])
  }, [])

  useEffect(() => {
    const filePaths = files.map(f => f.accepted === true)
    if (filePaths.length > 0 && completedFiles.length===filePaths.length) {
      if (onFileCompleted) onFileCompleted(completedFiles)
    }
  }, [completedFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

  return (
    <>
      <div {...getRootProps()} className={`p-4 rounded-md border-2 border-dashed ${isDragActive ? `bg-accent text-accent-content border-accent-focus` : `bg-secondary text-secondary-content border-secondary-focus`}`}>
        <input {...getInputProps()} />
        {
          children || 
          isDragActive ? 
            <p>Drop n Go!!</p> :
            <p>Drag and drop file{limit !== 1 ? 's' :''} here, or click to select...</p> 
        }
      </div>
      <div className='min-w-full p-4 space-x-2'>
        <div className="columns-2 md:columns-3 lg:columns-4">
          {rejected.map(r => 
            <div className="relative md-2" key={r.id}>
              <div className="bg-success text-success-content overflow-hidden text-xs opacity-80 absolute bottom-6 mx-2 px-2 rounded-md">{r.file.name}</div>
              <progress
                className={`progress h-2 px-2 absolute bottom-2 z-2 opacity-80 drop-shadow-md progress-error`}
                value={100}
                max="100"
              />
              {r.errors.map((e) => (
                <div className="text-xs">{e.message}</div>
              ))}
            </div>
          )}
        {files.map(fileWrapper => (
          <SingleFileUploadWithProgress file={fileWrapper.file} onComplete={onFileComplete} key={fileWrapper.id} />
        ))}
        </div>
      </div>
    </>
  )
}

export default Dropzone
// export { FileUploading, FileUploadError }

