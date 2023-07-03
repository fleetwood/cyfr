import React, { createContext, ReactNode, useContext } from "react"
import { CyfrUser } from "../../prisma/prismaContext"
import useRocketQuery from "hooks/useRocketQuery"

type CyfrUserProviderProps = {
  children?: ReactNode
}

export const CyfrUserContext = createContext({} as any)
export const useCyfrUserContext = () => useContext(CyfrUserContext)

const CyfrUserProvider = ({ children }: CyfrUserProviderProps) => {
  const value = useRocketQuery<CyfrUser>({name: 'cyfrUser', url: '/me'})
  return (
    <CyfrUserContext.Provider value={value}>
      {children}
    </CyfrUserContext.Provider>
)}
export default CyfrUserProvider
