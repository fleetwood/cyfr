export const __prod__ = process.env.NODE_ENV === 'production'
export const __logLevel__ = process.env.NEXT_PUBLIC_LOG_LEVEL || 'ERROR'

export const __proto__ = process.env.NEXT_PUBLIC_PROTOCOL || 'http'
export const __host__ = process.env.NEXT_PUBLIC_HOST || 'localhost'
export const __port__ = Number(process.env.NEXT_PUBLIC_PORT) || 3000
export const __site__ = process.env.NEXT_PUBLIC_SITE || `${__proto__}:${__host__}:${__port__}`

export const __cyfr_refetch__ = Number(process.env.NEXT_PUBLIC_REFETCH || 1000)

export const __redis_url__:string = process.env.NEXT_PUBLIC_REDIS_URL||''

console.log(JSON.stringify({
    starting: '********** constants **********',
    __prod__,
    __logLevel__,
    __proto__,
    __host__,
    __port__,
    __site__,
    __cyfr_refetch__,
    __redis_url__,
    done: '********** / constants **********',
}, null, 4))