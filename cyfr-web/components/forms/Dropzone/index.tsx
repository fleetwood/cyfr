import { useCallback, useState } from "react";
import { Accept, FileError, FileRejection, useDropzone } from 'react-dropzone';
import { uuid } from "../../../utils/helpers";
import FileUploadError from "./FileUploadError";
import FileUploading from "./FileUploading";

const fileTypes = ["JPG", "PNG", "GIF"];

export interface UploadedFile {
  file: File
  errors: FileError[]
}

export type DropzoneProps = {
  limit?: number
  cols?: number
  allowed?: 'img'|'vid'|'any'
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


function Dropzone({limit=-1, cols, allowed}:DropzoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [onDragClass, setOnDragClass] = useState<string>('border-primary-focus')
  const accept:Accept = 
      allowed && allowed === 'img' ?
        { 'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.tiff', '.webp']}
    : allowed && allowed === 'vid' ?
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
  }, [])

  const {getRootProps, getInputProps} = useDropzone({
    onDrop, accept, 
    onDragOver: () => {setOnDragClass(() => 'border-secondary-focus bg-secondary bg-opacity-25')}, 
    onDragLeave: () => {setOnDragClass(() => 'border-primary-focus')}
  })

  return (
    <div className="">
      <div {...getRootProps( )} className={`w-full min-h-12 cursor-pointer text-center p-4 border-2 border-dashed hover:border-secondary-focus ${onDragClass}`} >
        <input {...getInputProps()}/>
        <p>Drag file{limit !== 1 ? 's' :''} here</p>
      </div>
      <div className={`w-full inline-grid ${cols ? `grid-${cols}` : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'} justify-between space-x-2`}>
        {files.slice(0,limit>0?limit:files.length).map(fileWrapper => 
          !fileWrapper.errors.length ? 
            <FileUploading file={fileWrapper.file} key={uuid()} /> : 
            <FileUploadError file={fileWrapper.file} errors={fileWrapper.errors} />
        )}
        {files.slice(limit>0?limit:files.length).map(fileWrapper =>
            <FileUploadError file={fileWrapper.file} errors={[{code: 'exceded limit', message:'Exceeded allowed limit'}]} />
        )}
      </div>
    </div>
  );
}

export default Dropzone
export { FileUploading, FileUploadError };

