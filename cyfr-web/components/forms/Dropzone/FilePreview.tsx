import { useEffect, useState } from "react"
import { log } from "../../../utils/log"
import { uuid } from "../../../utils/helpers"
import Spinner from "../../ui/spinner"

type FilePreviewProps = {
    preview?: string|null
    file: File
}

const FilePreview = ({file, preview}:FilePreviewProps) => (
    <div className={`w-full h-full absolute bottom-0 bg-contain bg-no-repeat`} style={preview? {backgroundImage: `url(${preview})`}:{}}>
        <div className="w-full h-full bg-base-100 bg-opacity-10 px-4 pt-2 pb-4 text-base-content text-xs font-semibold absolute bottom-0">
            {file.name}
            {!preview && <Spinner center={true} />}
        </div>
    </div>
)

export default FilePreview