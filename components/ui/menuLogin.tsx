import { useSession } from 'hooks/useSession'
import { DefaultSession } from 'next-auth'
import { BuiltInProviderType } from 'next-auth/providers'
import {
  ClientSafeProvider,
  getProviders,
  LiteralUnion,
  signIn,
  signOut,
} from 'next-auth/react'
import { useRouter } from 'next/router'
import useCyfrUserApi from 'prisma/useApi/cyfrUser'
import { FC, useEffect, useState } from 'react'
import { FacebookSVG, GoogleSVG, TwitterSVG, WordpressSVG } from './svgs'

// @ts-ignore
const MenuLogin: FC = () => {
  const [providers, setproviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>()

  const Router = useRouter()
  const [user, setUser] = useState<DefaultSession['user']>()
  const [session, loading] = useSession({
    required: false,
    queryConfig: {
      staleTime: 60 * 1000 * 60 * 3, // 3 hours
      refetchInterval: 60 * 1000 * 5, // 5 minutes
    },
  })
  const { cyfrUser } = useCyfrUserApi()

  useEffect(() => {
    const setTheProviders = async () => {
      const setupProviders = await getProviders()
      setproviders(setupProviders)
    }
    setTheProviders()
  }, [])

  useEffect(() => {
    if (session?.user) {
      setUser(session.user)
    }
  }, [session])

  return (
    <div className="flex flex-row justify-evenly pl-4 pt-4">
        <button
        onClick={() => signIn(providers?.google.id)}
        className="hover:text-primary hover:scale-125 transition-all duration-200 ease-in-out flex"
        >
        <GoogleSVG />
        </button>
        <button
        onClick={() => signIn(providers?.twitter.id)}
        className="hover:text-primary hover:scale-125 transition-all duration-200 ease-in-out flex"
        >
        <TwitterSVG />
        </button>
        <button
        onClick={() => signIn(providers?.facebook.id)}
        className="hover:text-primary hover:scale-125 transition-all duration-200 ease-in-out flex"
        >
        <FacebookSVG />
        </button>
        <button
        onClick={() => signIn(providers?.wordpress.id)}
        className="hover:text-primary hover:scale-125 transition-all duration-200 ease-in-out flex"
        >
        <WordpressSVG />
        </button>
    </div>
)}

export default MenuLogin
