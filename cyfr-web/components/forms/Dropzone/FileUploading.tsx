import { useEffect, useState } from "react"
import { log, logError } from "../../../utils/log"
import { FileError } from "react-dropzone"
import { uuid } from "../../../utils/helpers"
import FilePreview from "./FilePreview"
import { CompleteFile } from "."
import { cloudinary } from "../../../utils/cloudinary"

type FileUploadingProps = {
    file: File
    onFileComplete: Function
}

const FileUploading = ({file, onFileComplete}:FileUploadingProps) => {
    const [fileProgress, setFileProgress] = useState<number>(0)
    const [fileErrors, setFileErrors] = useState<FileError[]>([])
    const [preview, setPreview] = useState<string|null>(null)
    
    const onProgress = (p:number) => setFileProgress(() => p)

    useEffect(() => {
        const uploadedFile = cloudinary.upload({file, onProgress})
            .then((res) => {
                const file = JSON.parse(res as unknown as string)
                if (file.secure_url) {
                    setPreview(file.secure_url)
                    onFileComplete(file as unknown as CompleteFile)
                }
                else if (file.error) {
                    setFileErrors(c => [...c,file.error])
                }
            })
            .catch(e => {
                logError(JSON.stringify(e))
            })
    },[])

    const progressStyle = (e:boolean,p:number) => e ? 'progress-error' : p < 100 ? 'progress-info' : 'progress-success'

    return (
        <div className="my-2 h-32 flex">
            <div className="my-2 w-full h-full relative">
                { 
                    fileErrors.length > 0 ? fileErrors.map(e => <div key={uuid()}>{e.code} {e.message}</div>)
                    :
                    <FilePreview file={file} preview={preview} />
                }
                <progress className={`progress h-2 px-2 absolute bottom-0 z-2 ${progressStyle(fileErrors.length>0,fileProgress)}`} value={fileProgress} max="100" />
            </div>
        </div>
    )
}

export default FileUploading