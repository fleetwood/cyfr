import React, { useCallback, useEffect, useState } from "react"
import { FileRejection, useDropzone } from 'react-dropzone'
import { dedupe, uuid } from "../../../utils/helpers"
import UploadFileView from "./UploadingFileView"
import { UploadableFile, CompleteFile, DropzoneProps } from "./types.defs"
import {Image as PrismaImage} from './../../../prisma/prismaContext'
import useDebug from "../../../hooks/useDebug"
const {debug, jsonBlock} = useDebug("components/forms/Dropzone/index")

function Dropzone({limit=-1, onDropComplete, onDropChange, children}:DropzoneProps) {
  const [files, setFiles] = useState<UploadableFile[]>([])
  const [rejected, setRejected] = useState<UploadableFile[]>([])
  const [completedFiles, setCompletedFiles] = useState<PrismaImage[]>([])
  
  const getLimit = (a:any[]) => (limit > 0 ? limit-completedFiles.length : a.length)

  const onDrop = useCallback((acceptedFiles:File[], rejectedFiles:FileRejection[]) => {
    debug(`onDrop`,{acceptedFiles, rejectedFiles})
    
    const mapAccepted = acceptedFiles.slice(0, getLimit(acceptedFiles)).map(file => ({file, errors: [], id: uuid()}))
    debug('onDrop.mapAccepted', {files, acceptedFiles, mapAccepted, completedFiles })
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

  const onFileChange = (file:any) => onDropChange ? onDropChange(file) : {}

  useEffect(() => {
    if (files.length > 0 && completedFiles.length===files.length) {
      if (onDropComplete) {
        onDropComplete(completedFiles)
      }
    }
  }, [completedFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

  const getWidth = (file:PrismaImage) => Math.round(60/file.height!*file.width!)

  return (
    <>
      {jsonBlock({
        limit, 
        getLimit: getLimit([]), 
        fileCount: files.length,
        completedFiles: completedFiles.length
      })}
      <div {...getRootProps()} className={`p-4 rounded-md border-2 border-dashed ${isDragActive ? `bg-accent text-accent-content border-accent-focus` : `bg-secondary text-secondary-content border-secondary-focus`}`}>
        <input {...getInputProps()} />
        {children? children :
          isDragActive ? 
            <p>Drop n Go!!</p> :
            limit === 1 
              ? <p>Drop your file here</p> 
              : <p>Drop up to <strong>{getLimit([])}</strong> files here, or click to select...</p>
        }
        
      </div>
      <div className='min-w-full p-4 space-x-2'>
        <div className="flex space-x-2">
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
            <UploadFileView {...{file}} onUploadComplete={onFileComplete} onUploadChange={onFileChange} key={file.id} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Dropzone

export type {UploadableFile, CompleteFile, DropzoneProps}
