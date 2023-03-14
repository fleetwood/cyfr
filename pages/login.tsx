import React, { FC, useState, useEffect } from "react"
import {
  getProviders,
  signOut,
  signIn,
  ClientSafeProvider,
  LiteralUnion,
  getCsrfToken,
} from "next-auth/react"
import { BuiltInProviderType } from "next-auth/providers"
import { useSession } from "../lib/next-auth-react-query"
import MainLayout from "../components/layouts/MainLayout"
import {
  FacebookSVG,
  GoogleSVG,
  TwitterSVG,
  WordpressSVG,
} from "../components/ui/svgs"
import { DefaultSession } from "next-auth"
import { apiUrl } from "../utils/api"
import useDebug from "../hooks/useDebug"
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link"

const {debug} = useDebug('pages/login')

type LoginProps = {
  csrfToken: string | undefined
}

// @ts-ignore
const Login: FC = ({csrfToken}: LoginProps) => {
  const [providers, setproviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>()
  const [user, setUser] = useState<DefaultSession["user"]>()
  const [session, loading] = useSession({
    required: false,
    queryConfig: {
      staleTime: 60 * 1000 * 60 * 3, // 3 hours
      refetchInterval: 60 * 1000 * 5, // 5 minutes
    },
  })

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
    <MainLayout
      sectionTitle="Login"
      subTitle={user ? user.name || user.email || undefined : "Please login"}
    >
      <div className="p-4 bg-base-100 rounded-lg">
        {session && (
          <div>
            <div>
              Signed in as <span className="font-semibold">{session.user?.name}</span><br />
            </div>
            <div className="flex justify-items-start space-x-4">
            
            <Link
              href={`/user/${user?.name?.replace(" ","-")}`}
              className="bg-primary hover:bg-primary-focus text-primary-content p-4 max-h-fit content-center transition-colors duration-200 ease-in-out"
            >
              Dashboard (TBD)
            </Link>
            <Link
              href={`/user/${user?.name?.replace(" ","-")}`}
              className="bg-primary hover:bg-primary-focus text-primary-content p-4 max-h-fit content-center transition-colors duration-200 ease-in-out"
            >
              Profile
            </Link>
            <Link
              href={`/user/account`}
              className="bg-primary hover:bg-primary-focus text-primary-content p-4 max-h-fit content-center transition-colors duration-200 ease-in-out"
            >
              Account
            </Link>

            <Link
              href={'#'}
              onClick={() => signOut()}
              className="bg-secondary hover:bg-secondary-focus text-secondary-content p-4 max-h-fit content-center transition-colors duration-200 ease-in-out"
            >
              Sign out
            </Link >

            </div>
          </div>
        )}
        {!session && (
          <>
            <p className="border-t border-t-secondary opacity-50 my-4">
              Login with any of the following
            </p>
            <div className="flex flex-row justify-evenly">
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
          </>
        )}
      </div>
    </MainLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const csrfToken = await getCsrfToken(context) || undefined
  debug('getServerSideProps', {csrfToken})
  return {
    props: { csrfToken },
  }
}

export default Login
