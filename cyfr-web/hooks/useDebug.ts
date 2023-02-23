import { __logLevel__ } from "../utils/constants"
import { log } from "../utils/log"

const DEBUG = 'DEBUG'
const INFO = 'INFO'
const ERROR = 'ERROR'

/*
        debug   info    todo    error <- method
DEBUG   true    true    true    false
INFO    false   true    true    false
ERROR   false   false   true    true
  ^
level

*/

type useDebugProps = {
  fileName: string
  level?: 'DEBUG'|'INFO'|'ERROR'|string
}

const useDebug = ({fileName, level=__logLevel__}:useDebugProps) => {
  const fileMethod = (method: string) => `${fileName}.${method}`
  const trace = (method: string, t?: any) => log(`
..........................................
${fileMethod(method)} 
  ..............
${t ? JSON.stringify({ ...(t || null) },null,2) : ''}
..........................................
  
`) 
  
  const error = (method: string, data?: any) => trace(method, {error: '**************ERROR**************', data})
  
  const debug = (method: string, data?: any) => {
    if(level === DEBUG) {
      trace(method, {level, data})
    }
  }
  const info  = (method: string, data?: any) => {
    if(level === DEBUG || level === INFO) {
      trace(method, {level, data})
    }
  }
  
  const todo  = (method: string, data?: any) => {
    if(level === DEBUG || level === INFO) {log(`
TODO************************
${fileMethod(method)} 
****************************
${data 
// if there's data
? JSON.stringify({
    level, data 
  },null,2)
// if no data
: level}
****************************`
  )}}

  return {todo, debug, info, error, fileMethod}
}
export default useDebug
