import { Children, ReactNode, useCallback, useEffect, useState } from "react";
import { Accept, FileError, FileRejection, useDropzone } from 'react-dropzone';
import { uuid } from "../../../utils/helpers";
import FileUploadError from "./FileUploadError";
import FileUploading from "./FileUploading";
import { log } from "../../../utils/log";
import { isNullOrUndefined } from "util";

const fileTypes = ["JPG", "PNG", "GIF"];

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
  cols?: number
  types?: 'img'|'vid'|'any'
  onFileCompleted: Function
  show?: 'zone'|'results'|'all'|'none'|null
  children?: ReactNode
}

const getAllowed = (a:string) => {
  switch (a) {
    case 'img':
      return { 'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.tiff', '.webp']}
      
    case 'vid':
      return { 'video/*': ['.mov', '.mp4', '.webm', '.mpeg'  ] }

      default: 
      return  ''
  }
}

function Dropzone({limit=-1, show = 'all', cols, types, onFileCompleted, children}:DropzoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [onDragClass, setOnDragClass] = useState<string>('border-primary-focus')
  const [showResults, setShowResults] = useState<boolean>(true)
  const [showZone, setShowZone] = useState<boolean>(true)

  const accept:Accept = 
      types && types === 'img' ?
        { 'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.tiff', '.webp']}
    : types && types === 'vid' ?
        { 'video/*': ['.mov', '.mp4', '.webm', '.mpeg'  ] } 
    : 
      { 
        'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.tiff', '.webp'],
        'video/*': ['.mov', '.mp4', '.webm', '.mpeg'  ] 
      }
  
  const onDrop = useCallback((acceptedFiles:File[], rejectedFiles:FileRejection[]) => {
    const mappedAcceptedFiles = acceptedFiles.map( file => ({file, errors: []}))
    setFiles((curr) => [...curr, ...mappedAcceptedFiles, ...rejectedFiles])
    setOnDragClass(() => 'border-primary-focus')
    setShowZone(false)
  }, [])

  const {getRootProps, getInputProps} = useDropzone({
    onDrop, accept, 
    onDragOver: () => {setOnDragClass(() => 'border-secondary-focus bg-secondary bg-opacity-25')}, 
    onDragLeave: () => {setOnDragClass(() => 'border-primary-focus')}
  })

  const reset = () => {
    setFiles([])
    setShowResults((s) => show === 'all' || show === 'results')
    setShowZone((s) => show === 'all' || show === 'zone')
  }

  useEffect(() => {
    log(`Dropzone show prop changed ${show}`)
    setShowResults((s) => show === 'all' || show === 'results')
    setShowZone((s) => show === 'all' || show === 'zone')
  },[show])

  return (
    <div className="">
      {showZone && 
        <div {...getRootProps( )} className={`w-full min-h-12 cursor-pointer text-center p-4 border-2 border-dashed hover:border-secondary-focus ${onDragClass}`} >
          <input {...getInputProps()}/>
          {children || <p>Drag file{limit !== 1 ? 's' :''} or click here</p> }
        </div>
      }
      {showResults &&
        <div className={`w-full inline-grid ${cols ? `grid-${cols}` : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'} justify-between space-x-2`}>
        {/* <p>ShowResults: {show}|{showResults.toString()}|{(show === 'all' || show === 'results').toString()}</p> */}
          {files.slice(0,limit>0?limit:files.length).map(fileWrapper => 
            !fileWrapper.errors.length ? 
            <FileUploading file={fileWrapper.file} onFileComplete={onFileCompleted} key={uuid()} /> : 
            <FileUploadError file={fileWrapper.file} errors={fileWrapper.errors} />
          )}
          {files.slice(limit>0?limit:files.length).map(fileWrapper =>
            <FileUploadError file={fileWrapper.file} errors={[{code: 'exceded limit', message:'Exceeded allowed limit'}]} />
          )}
        </div>
      }
      <button className="btn btn-primary" onClick={()=>reset()}>RESET</button>
    </div>
  );
}

export default Dropzone
export { FileUploading, FileUploadError };

