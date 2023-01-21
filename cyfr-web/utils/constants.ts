export const __prod__ = process.env.NODE_ENV === 'production'

export const __proto__ = process.env.NEXT_PUBLIC_PROTOCOL || 'http'
export const __host__ = process.env.NEXT_PUBLIC_HOST || 'localhost'
export const __port__ = Number(process.env.NEXT_PUBLIC_PORT) || 3000
export const __site__ = process.env.NEXT_PUBLIC_SITE || `${__proto__}:${__host__}:${__port__}`

export const __cyfr_refetch__ = Number(process.env.NEXT_PUBLIC_REFETCH || 1000)

export const __redis_url__:string = process.env.NEXT_PUBLIC_REDIS_URL||''