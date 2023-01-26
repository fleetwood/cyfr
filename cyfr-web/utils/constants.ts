export const __prod__ = process.env.NODE_ENV === 'production'

export const __proto__ = process.env.NEXT_PUBLIC_PROTOCOL || 'http'
export const __host__ = process.env.NEXT_PUBLIC_HOST || 'localhost'
export const __port__ = Number(process.env.NEXT_PUBLIC_PORT) || 3000
export const __site__ = process.env.NEXT_PUBLIC_SITE || `${__proto__}:${__host__}:${__port__}`

export const __cyfr_refetch__ = Number(process.env.NEXT_PUBLIC_REFETCH || 1000)

export const __redis_url__:string = process.env.NEXT_PUBLIC_REDIS_URL||''

export const cloudinary = {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME||null,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY||null,
    apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET||null,
    url: process.env.NEXT_PUBLIC_CLOUDINARY_URL||null,
    demo_url: process.env.NEXT_PUBLIC_CLOUDINARY_DEMO_URL||'404',
}