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

import {
  FacebookSVG,
  GoogleSVG,
  TwitterSVG,
  WordpressSVG,
} from "../components/ui/svgs";
import { __host__, __port__ } from "../utils/constants";
import MainLayout from "./../components/layouts/MainLayout";
import PageStatus from "../components/containers/PageStatus";
import { UserSession } from "../components/protected/UserSession";
import { log } from "console";

type NextAuthProvider = Record<LiteralUnion<BuiltInProviderType, string>,ClientSafeProvider> | null

const Login = (props: { csrfToken: string | number | readonly string[] | undefined; }) => {
  const [providers, setProviders] = useState<NextAuthProvider>();
  const {session,user,error} = UserSession()

  useEffect(() => {
    const providerConfig = async () => setProviders(await getProviders());
    providerConfig();
  }, []);

  return (
    <MainLayout
      sectionTitle="Cyfr"
      subTitle="Login"
      className="text-gray-400"
    >
      <div className="m-0">
        <PageStatus error={error} watch={user} />
        {session && (
          <>
            Signed in as {user?.email} <br />
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
  const csrfToken = await getCsrfToken(context) || null;
  log("Login SSP", csrfToken);
  return {
    props: {
      csrfToken,
    },
  };
}

export default Login;
