import { useState } from "react"
import { FileError } from "react-dropzone"

type UploadingErrorProps = {
    file: File
    errors: FileError[]
}

const FileUploadError = ({file, errors}:UploadingErrorProps) => {
    const [preview, setPreview] = useState<string|null>(null)
    
    return (
        <div className="mt-4 w-full h-auto relative text-xs border border-error">
            <div className="w-full absolute top-0 p-2">
                <div className="font-semibold">{file.name}</div>
                <div>{file.type} : {file.size}</div>
                {errors.map(e => (
                    <>{e.code}</>
                ))}
            </div>
            <progress className="progress progress-error h-1 max-w-[100%] absolute bottom-0" value={100} max="100" />
        </div>
    )
}

export default FileUploadError