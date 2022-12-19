import type { GetServerSidePropsContext, NextPage } from "next";
import { DefaultSession, Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { useSession } from "../lib/next-auth-react-query";
import { GetResponseError, ResponseError, ResponseResult } from "../types/Response";
import { __prod__ } from "../utils/constants";
import { log } from "../utils/log";

type AccountPageResponse = ResponseResult<{
  account: {
    title: string;
    content: string;
  },
  session: Session
}>

const Account: NextPage = (
  props: AccountPageResponse
) => {
  const [error, setError] = useState<ResponseError>();
  const [account, setAccount] = useState();
  const [user, setUser] = useState<DefaultSession["user"] | undefined>();

  const [session, loading] = useSession({
    required: true,
    redirectTo: '/login',
    queryConfig: {
      staleTime: 60 * 1000 * 60 * 3, // 3 hours
      refetchInterval: 60 * 1000 * 5, // 5 minutes
    },
  });

  const handleLogout = async () => {
    setError(undefined);
    try {
      signOut();
    } catch (e) {
      log("logout error", e);
      setError(GetResponseError(e));
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <MainLayout
        className="scroll-smooth"
        sectionTitle="Cyfr"
        subTitle="The Writer's Site"
      >
        <h1>{user?.name}</h1>
        <button className="btn btn-primary mx-4 rounded-full w-fit" onClick={handleLogout}>Logout</button>
      </MainLayout>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { props:{ session: await getSession(context) }};
}

export default Account;
