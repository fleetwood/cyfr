import { useCallback, useEffect, useState } from "react"
import { FileRejection, useDropzone } from 'react-dropzone'
import { uuid } from "../../../utils/helpers"
import UploadFileView from "./UploadingFileView"
import { UploadableFile, CompleteFile, DropzoneProps } from "./types.defs"
import useDebug from "../../../hooks/useDebug"
const [debug] = useDebug("Dropzone/index")

function Dropzone({limit=-1, onUploadComplete, children}:DropzoneProps) {
  const [files, setFiles] = useState<UploadableFile[]>([])
  const [rejected, setRejected] = useState<UploadableFile[]>([])
  const [completedFiles, setCompletedFiles] = useState<CompleteFile[]>([])
  
  const getLimit = (a:any[]) => limit>0?limit:a.length

  const onDrop = useCallback((acceptedFiles:File[], rejectedFiles:FileRejection[]) => {
    debug(`onDrop`,{acceptedFiles, rejectedFiles})
    
    const mapAccepted = acceptedFiles.slice(0, getLimit(acceptedFiles)).map(file => ({file, errors: [], id: uuid()}))
    const mapRejected = [
      ...acceptedFiles.slice(getLimit(acceptedFiles)).map(file => ({file, accepted: true, errors: [{code: 'limit', message: `Exceed allowed limit (${limit})`}], id: uuid()})),
      ...rejectedFiles.map(file => ({...file, accepted: false, id: uuid()}))
    ]
    
    setFiles((f) => [...f, ...mapAccepted])
    setRejected((f) => [...f, ...mapRejected])
  }, [])

  const onFileComplete = useCallback((e:any) => {
    setCompletedFiles((current) => [...current, e])
  }, [])

  useEffect(() => {
    if (files.length > 0 && completedFiles.length===files.length) {
      if (onUploadComplete) {
        debug(`useEffect completedFiles: ${completedFiles.length}/${files.length}`)
        onUploadComplete(completedFiles)
      }
    }
  }, [completedFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

  return (
    <>
      <div {...getRootProps()} className={`p-4 rounded-md border-2 border-dashed ${isDragActive ? `bg-accent text-accent-content border-accent-focus` : `bg-secondary text-secondary-content border-secondary-focus`}`}>
        <input {...getInputProps()} />
        {children? children :
          isDragActive ? 
            <p>Drop n Go!!</p> :
            limit === 1 
              ? <p>Drop your file here</p> 
              : <p>Drop up to <strong>{limit}</strong> files here, or click to select...</p>
        }
      </div>
      <div className='min-w-full p-4 space-x-2'>
        <div className="columns-2 md:columns-4 lg:columns-6">
          {rejected.map(r => 
            <div className="relative mb-2" key={r.id}>
              <div className="bg-success text-success-content overflow-hidden text-xs opacity-80 absolute bottom-6 mx-2 px-2 rounded-md">{r.file.name}</div>
              <progress
                className={`progress h-2 px-2 absolute bottom-2 z-2 opacity-80 drop-shadow-md progress-error`}
                value={100}
                max="100"
              />
              {r.errors.map((e,i) => (
                <div className="text-xs" key={'error:'+i+':'+r.id}>{e.message}</div>
              ))}
            </div>
          )}
          {files.map(file => (
            <UploadFileView {...{file}} onComplete={onFileComplete} key={file.id} />
          ))}
          {completedFiles.length > 0 &&
            <p>Completed Files {completedFiles.length} of {files.length}</p>
          }
        </div>
      </div>
    </>
  )
}

export default Dropzone

export type {UploadableFile, CompleteFile, DropzoneProps}