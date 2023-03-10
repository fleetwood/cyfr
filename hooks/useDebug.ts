import { __logLevel__ } from "../utils/constants"

type DebugProps = 'DEBUG'|'INFO'|'ERROR'

const useDebug = (fileName:string, level:DebugProps=__logLevel__ as unknown as DebugProps) => {
  const fileMethod = (method: string) => `${fileName}.${method}`
  const lineBreak = (char:string='.',label?:string) => Array(10).map((a,i) => label && i === 5 ? label : char).join()
  const methodData = (data?:any) => data ? lineBreak()+stringify({ ...(data || null) }) : ``

  const stringify = (data:any) => JSON.stringify(data, null, 2)

  const log = (method: string, t?: any) => console.log(`
${lineBreak()}
${fileMethod(method)} 
${methodData(t)}
${lineBreak()}
`) 
  
  const err = (method: string, data?: any) => log(method, {error: lineBreak('!', 'ERROR'), data})
  
  const debug = (method: string, data?: any) => {
    if(level === 'DEBUG') {
      log(method, {level, data})
    }
  }
  const info  = (method: string, data?: any) => {
    if(level === 'DEBUG' || level === 'INFO') {
      log(method, {level, data})
    }
  }
  
  const todo  = (method: string, message: string) => {
    if(level === 'DEBUG' || level === 'INFO') {log(`
${lineBreak('*','TODO')}
${fileMethod(method)} 
${message}
${lineBreak('*','TODO')}
`
  )}}

  return {debug, info, err, todo, stringify, fileMethod}
}
export default useDebug
