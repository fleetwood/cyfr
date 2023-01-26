import { useEffect, useState } from "react"
import { cloudinary } from "../../../utils/constants"
import { log, logError } from "../../../utils/log"
import { FileError } from "react-dropzone"
import { uuid } from "../../../utils/helpers"
import FilePreview from "./FilePreview"

type FileUploadingProps = {
    file: File
}

type UploadingProps = {
    file: File
    onProgress: Function
}

function uploadFile({file, onProgress}:UploadingProps) {
    const url = cloudinary.demo_url
    const upload_preset = 'docs_upload_example_us_preset'

    return new Promise((res,rej) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', url)

        xhr.onload = () => {
            const resp = xhr.responseText
            res(resp)
        }

        xhr.onerror = (e) => {
            log(`FileUploading.onError: ${JSON.stringify(e)}`)
            rej(e)
        }

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                onProgress(Math.round((e.loaded/e.total)*100))
            }
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', upload_preset)

        xhr.send(formData)
    })
}

const FileUploading = ({file}:FileUploadingProps) => {
    const [fileProgress, setFileProgress] = useState<number>(0)
    const [fileErrors, setFileErrors] = useState<FileError[]>([])
    const [preview, setPreview] = useState<string|null>(null)
    
    const onProgress = (p:number) => setFileProgress(() => p)

    useEffect(() => {
        const uploadedFile = uploadFile({file, onProgress})
            .then((res) => {
                const file = JSON.parse(res as unknown as string)
                if (file.secure_url) {
                    setPreview(file.secure_url)
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