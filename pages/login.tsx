import { InferGetServerSidePropsType } from "next"
import { DefaultSession } from "next-auth"
import { BuiltInProviderType } from "next-auth/providers"
import {
  ClientSafeProvider, getCsrfToken, getProviders, LiteralUnion, signIn, signOut
} from "next-auth/react"
import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"
import { useCyfrUserContext } from "../components/context/CyfrUserProvider"
import MainLayout from "../components/layouts/MainLayout"
import {
  FacebookSVG,
  GoogleSVG,
  TwitterSVG,
  WordpressSVG
} from "../components/ui/svgs"
import useDebug from "../hooks/useDebug"
import { useSession } from "../lib/next-auth-react-query"
import { apiUrl } from "../utils/api"

const {debug} = useDebug('pages/login')

// @ts-ignore
const Login: FC = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [providers, setproviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>()

  const Router = useRouter()
  const [user, setUser] = useState<DefaultSession["user"]>()
  const [cyfrUser] = useCyfrUserContext()
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

    if (session?.user && (!cyfrUser || cyfrUser.membership === null)) { 
        Router.replace('/account')
    }
  }, [session])

  return (
    <MainLayout
      sectionTitle="Login"
      subTitle={user ? user.name || user.email || undefined : "Please login"}
    >
      <div className="p-4 bg-base-100 rounded-xl">
        {session && (
          <>
            Signed in as {session.user?.email} <br />
            <button
              onClick={() => signOut()}
              className="bg-primary hover:bg-primary-focus text-primary-content p-2 mx-2 transition-colors duration-200 ease-in-out"
            >
              Sign out
            </button>
          </>
        )}
        {!session && (
          <>
            <form
              action={apiUrl("/signin/email")}
              method="POST"
              className="flex space-x-1"
            >
              <input
                name="csrfToken"
                type="hidden"
                defaultValue={
                  // @ts-ignore
                  props.csrfToken
                }
              />
              <input
                id="input-email-for-email-provider"
                type="text"
                name="email"
                placeholder="email@example.com"
                className="p-2 bg-base-200 text-primary-content"
              />
              <button
                type="submit"
                className="btn btn-primary transition-colors duration-200 ease-in-out"
              >
                Email Login
              </button>
            </form>
            <p className="border-t border-t-secondary opacity-50 my-4">
              Or login with any of the following
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

export async function getServerSideProps(context: any) {
  const csrfToken = await getCsrfToken(context)
  debug('getServerSideProps', {csrfToken})
  return {
    props: {
      csrfToken,
    },
  }
}

export default Login
