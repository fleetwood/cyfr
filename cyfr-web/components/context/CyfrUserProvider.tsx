import React, { createContext, ReactNode, useContext } from "react"
import useCyfrUser, { useCyfrUserHookType } from "../../hooks/useCyfrUser"

type CyfrUserProviderProps = {
  children?: ReactNode
}

export const CyfrUserContext = createContext({} as any)
export const useCyfrUserContext = () => useContext(CyfrUserContext)

const CyfrUserProvider = ({ children }: CyfrUserProviderProps) => 
    <CyfrUserContext.Provider value={useCyfrUser()}>
      {children}
    </CyfrUserContext.Provider>

export default CyfrUserProvider
