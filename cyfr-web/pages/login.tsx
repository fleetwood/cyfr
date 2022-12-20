import React, { FC, useState, useEffect } from "react";
import {
  getProviders,
  signOut,
  signIn,
  ClientSafeProvider,
  LiteralUnion,
  getCsrfToken,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { useSession } from "../lib/next-auth-react-query";
import MainLayout from "../components/layouts/MainLayout";
import {
  FacebookSVG,
  GoogleSVG,
  TwitterSVG,
  WordpressSVG,
} from "../components/ui/svgs";
import { __host__, __port__ } from "../utils/constants";
import { DefaultSession } from "next-auth";
import { log } from "../utils/log";

const Login: FC = (props) => {
  const [providers, setproviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>();
  const [user, setUser] = useState<DefaultSession["user"]>();
  const [session, loading] = useSession({
    required: false,
    queryConfig: {
      staleTime: 60 * 1000 * 60 * 3, // 3 hours
      refetchInterval: 60 * 1000 * 5, // 5 minutes
    },
  });

  useEffect(() => {
    const setTheProviders = async () => {
      const setupProviders = await getProviders();
      setproviders(setupProviders);
    };
    setTheProviders();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <MainLayout
      sectionTitle="Login"
      subTitle={
        user
          ? user.name || user.email || undefined
          : "Please login"
      }
      className="text-gray-400"
    >
      <div className="m-0">
        {/* {error && <div className="text-red-400 italic">{error.code }: {error.message}</div>} */}
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
              action={`http://${__host__}:${__port__}/api/auth/signin/email`}
              method="POST"
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
                className="p-2 mx-2 bg-base-200 text-primary-content"
              />
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-500 text-gray-200 hover:text-white p-2 w-full transition-colors duration-200 ease-in-out"
              >
                Email Login
              </button>
            </form>
            <p className="border-t border-t-secondary opacity-50 my-4">Or login with any of the following existing accounts</p>
            <div className="flex justify-evenly space-x-2">
              <button
                onClick={() => signIn(providers?.google.id)}
                className="transition-colors duration-200 ease-in-out flex"
              >
                <GoogleSVG />
              </button>
              <button
                onClick={() => signIn(providers?.twitter.id)}
                className="transition-colors duration-200 ease-in-out flex"
              >
                <TwitterSVG />
              </button>
              <button
                onClick={() => signIn(providers?.facebook.id)}
                className="transition-colors duration-200 ease-in-out flex"
              >
                <FacebookSVG />
              </button>
              <button
                onClick={() => signIn(providers?.wordpress.id)}
                className="transition-colors duration-200 ease-in-out flex"
              >
                <WordpressSVG />
              </button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export async function getServerSideProps(context: any) {
  const csrfToken = await getCsrfToken(context);
  log("Login SSP", csrfToken);
  return {
    props: {
      csrfToken,
    },
  };
}

export default Login;
