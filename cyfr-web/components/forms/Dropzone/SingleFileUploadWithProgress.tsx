import { useEffect, useState } from "react";
import { cloudinary, config } from "../../../utils/cloudinary";
import { FileError } from "react-dropzone";
import { log, logError } from "../../../utils/log";
import Spinner, { SpinnerSize } from "../../ui/spinner";

export interface SingleFileUploadWithProgressProps {
  file: File
  onComplete?: Function
}

export type CompleteFile = {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string; // "2023-01-26T19:49:28Z"
  tags: [string];
  pages: number;
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string; //http
  secure_url: string; //https
  folder: string;
  access_mode: string;
  metadata: any;
  existing: boolean;
  original_filename: string;
};

const SingleFileUploadWithProgress = ({file, onComplete}: SingleFileUploadWithProgressProps) => {
  const [fileProgress, setFileProgress] = useState<number>(0);
  const [fileErrors, setFileErrors] = useState<FileError[]>([]);
  const [preview, setPreview] = useState<CompleteFile | null>(null);

  const progressStyle = (e: boolean, p: number) =>
    e ? "progress-error" : p < 100 ? "progress-info" : "progress-success";

  const onProgress = (p: number) => {
    setFileProgress(p);
  };

  const onFileComplete = (e:any) => {
    if (onComplete) onComplete(e)
  };

  useEffect(() => {
    async function upload() {
      const url = await cloudinary.upload({ file, onProgress, onComplete: onFileComplete });
      if (url) {
        // @ts-ignore
        const file = JSON.parse(url) as unknown as CompleteFile;
        setPreview((c) => file);
      }
    }
    upload();
  }, []);

  return (
    <div className="relative md-2">
      {preview && 
        <div>
            <img src={preview.secure_url} className="mask mask-squircle" />
            <div className="bg-success text-success-content overflow-hidden text-xs opacity-80 absolute bottom-6 mx-2 px-2 rounded-md">{preview.original_filename+'.'+preview.format}</div>
        </div>}
      {!preview && fileErrors.length < 1 && <Spinner size={SpinnerSize.md} />}
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
  );
};

export default SingleFileUploadWithProgress;
