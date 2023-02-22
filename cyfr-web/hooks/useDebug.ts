import { __logLevel__ } from "../utils/constants"
import { log } from "../utils/log"

export type logLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR'

const DEBUG = 'DEBUG'
const INFO = 'INFO'
const ERROR = 'ERROR'

const useDebug = (fileName: string, level?:logLevel) => {
  const debugLevel = [ DEBUG, INFO, ERROR ]
  const infoLevel  = [        INFO, ERROR ]
  const errorLevel = [              ERROR ]

  const logLevel = level || __logLevel__

  const fileMethod = (method: string) => `${fileName}.${method}`
  const trace = (arr: string[], method: string, t?: any) => 
    arr.includes(logLevel) 
    ? log(`${fileMethod(method)} ${t ? JSON.stringify({ ...(t || null) },null,2) : ''}`) 
    : () => {}
  
  const todo  = (method: string, data?: any) => trace(infoLevel, method, data)
  const debug = (method: string, data?: any) => trace(debugLevel, method, data)
  const info  = (method: string, data?: any) => trace(infoLevel, method, data)
  const error = (method: string, data?: any) => trace(errorLevel, method, data)

  return [todo, debug, info, error, fileMethod]
}
export default useDebug
