import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useSession } from "../lib/next-auth-react-query";
import { Users, UserWithPosts } from "../prisma/users";
import { getApi, sendApi } from "../utils/api";
import { log, logError } from "../utils/log";

export type UseCyfrUser = [any, Dispatch<SetStateAction<any>>];

export const useCyfrUser = (user: any | null): UseCyfrUser => {
  const [session] = useSession({ required: false });
  const [cyfrUser, setCyfrUser] = useState<UserWithPosts | null>(null);

  useEffect(() => {
    setCyfrUser(user);
  }, [user]);

  useEffect(() => {
    if (session?.user) {
      getApi(`/user/byEmail/${session.user.email}`)
        .then((result) => {
          if (result.error) {
            throw result.error;
          }
          setCyfrUser(result.result);
        })
        .catch(error => {
          log('useCyfrUser ERROR',error)
        });
    }
  }, []);

  return [cyfrUser, setCyfrUser];
};
