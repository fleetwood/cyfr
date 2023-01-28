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
    image_url: string | null
    demo_url: string
} = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME||null,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY||null,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET||null,
    url: process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL||null,
    image_url: process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL+'/image/upload'||null,
    demo_url: process.env.NEXT_PUBLIC_CLOUDINARY_DEMO_URL||'404',
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

const isCloudinary = (url:string) => url.indexOf(config.image_url!) > -1

const upload = ({file, onProgress}:UploadingProps) => new Promise((res,rej) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', config.image_url!)

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

export const cloudinary = {upload, isCloudinary, resize, thumb}