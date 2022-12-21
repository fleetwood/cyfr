export type ResponseCode = {
    code: string
    message: string
}

export type ResponseError<T> = {
    error?: ResponseCode
    result?: T
}