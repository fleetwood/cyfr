import { ReactNode } from "react"
import { FileError } from "react-dropzone"
import { Image } from "prisma/prismaContext"

export const fileTypes = ["JPG", "PNG", "GIF"]

export type CompleteFile = {
  asset_id: string
  public_id: string
  version: number
  version_id: string
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string // "2023-01-26T19:49:28Z"
  tags: [string]
  pages: number
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string //http
  secure_url: string //https
  folder: string
  access_mode: string
  metadata: any
  existing: boolean
  original_filename: string
  visible: boolean
}

export interface UploadableFile {
  file: File
  id: string
  errors: FileError[]
}

export type DropzoneProps = {
  limit?: number
  onDropComplete?: (files:Image[]) => void
  onDropChange?: (file:any) => void
  children?: ReactNode
  showUploadProgress?: boolean
}

export interface UploadFileViewProps {
  file: UploadableFile
  onUploadComplete?: (files:Image[]) => void
  onUploadChange?: (file: any) => void
  showUploadProgress?: boolean
}
