import React, { createContext, ReactNode, useContext } from "react"
import useCyfrUser from "../../hooks/useCyfrUser"
import { CyfrUser } from "../../prisma/prismaContext"

type CyfrUserProviderProps = {
  children?: ReactNode
}

export const CyfrUserContext = createContext({} as any)
export const useCyfrUserContext = ():[cyfrUser:CyfrUser, loading:boolean, error:unknown, invalidate: () => void] => useContext(CyfrUserContext)

const CyfrUserProvider = ({ children }: CyfrUserProviderProps) => {
  const value:[CyfrUser, boolean, unknown, () => void] = useCyfrUser()
  return (
    <CyfrUserContext.Provider value={value}>
      {children}
    </CyfrUserContext.Provider>
)}
export default CyfrUserProvider
