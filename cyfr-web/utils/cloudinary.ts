import useCyfrUser, { useCyfrUserApi } from "../hooks/useCyfrUser";
import { UserWithPostsLikes } from "../prisma/types/user.def";
import { sendApi } from "./api";
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
    api: string
    cdn: string
    fetch: string
} = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME||null,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY||null,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET||null,
    url: process.env.NEXT_PUBLIC_CLOUDINARY_URL||null,
    api: `https://api.${process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || '404'}/image/upload`,
    cdn: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '404'}/image/upload`,
    fetch: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '404'}/image/fetch`,
}

const unsignedUploadPreset = "cyfr_unsigned"

const isCloudinary = (url:string) => {
    // log(`cloudinary.isCloudinary {
    //     ${url},
    //     ${config.cdn},
    //     ${url.indexOf(config.cdn) >= 0}
    // }`)
    return url.indexOf(config.cdn) >= 0
}

const cloudUrl = (url:string, mod:string) => {
    if (!isCloudinary(url)) return `${config.fetch}/${mod}/${url}`
    const a = url.split('/')
    a.splice(-3,1,mod)
    const res = a.join('/')
    // log(`cloudinary.cloudUrl {
    //     ${url},
    //     ${mod},
    //     ${res}
    // }`)
    return res
}

type cloudImageProps = {
    url: string,
    width: number
    height?: number | null
    face?: boolean | false
}

type getImagePropsType = cloudImageProps & {
    base: string
}
const getImageProps = (base:string, {...props}) => {
    let mod:Array<string> = [base]
    if (props.face) mod.push('g_auto')
    if (props.height) mod.push(`h_${props.height}`)
    if (props.width) mod.push(`w_${props.width}`)
    const m = mod.join(',')
    return m
}

/**
 * Create a thumbnail of the uploaded image
 * @param url string 
 * @param ...props cloudImageProps 
 * @returns string (url)
 */
const thumb = ({url, ...props}:cloudImageProps) => cloudUrl(url, getImageProps('c_thumb', props))

/**
 * Exact width and height without distortion
 * @param url string 
 * @param ...props cloudImageProps 
 * @returns string (url)
 */
const resize = ({url, ...props}:cloudImageProps) =>  cloudUrl(url, getImageProps(`c_fill`, props))

/**
 * Set to width and/or height with cropping
 * @param url string 
 * @param ...props cloudImageProps 
 * @returns string (url)
 */
const scale = ({url, ...props}:cloudImageProps) =>  cloudUrl(url, getImageProps('c_scale', props))

export type AvatarSizeProps = {sz: 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
/**
 * Create a thumbnail of the uploaded image
 * @param url string
 * @param size AvatarSizeProps
 * @returns string
 */
const avatar = (url:string, size: AvatarSizeProps) => cloudUrl(url, `t_avatar_${size}`)

/**
 * Upload a file to cloudinary
 * @param file string
 * @param onProgress Function 
 * @returns Promise<result, reject>
 */
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

export const cloudinary = {upload, isCloudinary, avatar, thumb, resize, scale}