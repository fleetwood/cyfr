import useDebug from "../hooks/useDebug"
const {debug, info} = useDebug('utils/cloudinary')

type UploadingProps = {
    file: File
    onProgress: Function
    onComplete?: Function
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

const isCloudinary = (url:string) => url.indexOf(config.cdn) >= 0

const cloudUrl = (url:string, mod:string) => {
    if (!isCloudinary(url)) return `${config.fetch}/${mod}/${url}`
    const a = url.split('/')
    a.splice(-3,1,mod)
    const res = a.join('/')
    return res
}

/**
 * @param url string
 * @param width number 
 * @param height (optional) number Will maintain aspect ration at given width if no height is set
 * @param face (optional) boolean 
 */
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
 * @param onComplete Function 
 * @returns Promise<result, reject>
 */
const upload = ({file, onProgress, onComplete}:UploadingProps) => new Promise((res,rej) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', config.api!)

    xhr.onload = () => {
        if (xhr.DONE) {
            const resp = xhr.responseText
            if(onComplete) onComplete(JSON.parse(resp))
            res(resp)
        }
    }

    xhr.onerror = (e) => {
        info(`uploadFile.onError:`, e)
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