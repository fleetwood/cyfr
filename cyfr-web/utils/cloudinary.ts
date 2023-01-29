import { log } from "./log";

type UploadingProps = {
    file: File
    onProgress: Function
}

export const config:{
    cloudName: string | null
    apiKey: string | null
    apiSecret: string | null
    url: string | null
    api: string | null
    cdn: string
} = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME||null,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY||null,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET||null,
    url: process.env.NEXT_PUBLIC_CLOUDINARY_URL||null,
    api: `https://api.${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '404'}/image/upload`,
    cdn: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '404'}/image/upload`,
}

const unsignedUploadPreset = "cyfr_unsigned"

// Create a thumbnail of the uploaded image
const thumb = (url:string) =>  url
    .split('/')
    // .splice(-2, 0, 'w_150,c_scale')
    .join('/')

// Create a thumbnail of the uploaded image
const resize = (url:string) =>  url
    .split('/')
    // .splice(-2, 0, 'w_150,c_scale')
    .join('/')

export type AvatarSizeProps = {
  sz: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}
// Create a thumbnail of the uploaded image
const avatar = (url:string, size: AvatarSizeProps) => {
    log(`cloudinary.avatar (
        ${url},
        ${size},
        ${isCloudinary(url)},
        ${config.cdn}
    )`)
    if (!isCloudinary(url)) return url
    const a = url.split('/')
    a.splice(-3,1,`t_avatar_${size}`)
    const res = a.join('/')
    log(`\t${res}`)
    return res
}

const isCloudinary = (url:string) => url.indexOf(config.cdn) >= 0

const upload = ({file, onProgress}:UploadingProps) => new Promise((res,rej) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', config.api!)

    xhr.onload = () => {
        const resp = xhr.responseText
        res(resp)
    }

    xhr.onerror = (e) => {
        log(`cloudinary.uploadFile.onError: ${JSON.stringify(e)}`)
        rej(e)
    }

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            onProgress(Math.round((e.loaded/e.total)*100))
        }
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', unsignedUploadPreset)

    xhr.send(formData)
})

export const cloudinary = {upload, isCloudinary, resize, thumb, avatar}