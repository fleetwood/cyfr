import useDebug, { DebugProps } from "hooks/useDebug"
import { NextApiResponse } from "next"

export const NotImplemented = async ():Promise<any> => {throw ({code: 'NI', message: 'Not implemented'})}

const useApiHandler = async <T>(
    res:  NextApiResponse,
    name:   string,
    cb:     Promise<T>,
    level?: DebugProps
) => {
    const {debug, err, stringify} = useDebug(name,level)
    try {
        const result = await cb
        res.status(200).json(result)   
    } catch (e) {
        err("FAIL", e)
        res.status(500).json({ code: name, message: stringify(e) })
    }
}
export default useApiHandler
