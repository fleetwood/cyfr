import React, { createContext, ReactNode, useContext } from "react"
import { AudienceType, GetAudienceLevel, canAccess } from "../../prisma/prismaContext"
// import useAudience, { useAudienceProps } from "../../hooks/useAudience"

type AudienceProviderProps = {
  children?: ReactNode
}

export const AudienceContext = createContext({} as any)
export const useAudienceContext = () => useContext(AudienceContext)

const AudienceProvider = ({ children }: AudienceProviderProps) => 
    <AudienceContext.Provider value={{GetAudienceLevel, AudienceType, canAccess}}>
      {children}
    </AudienceContext.Provider>

export default AudienceProvider
