import { DefaultSession } from "next-auth";

import { useEffect, useState } from "react";
import { useSession } from "../../lib/next-auth-react-query";
import { ResponseError } from "../../types/Response";

export const UserSession = (props?: {
  required: boolean|undefined;
  redirectTo: string|undefined;
}) => {
  const { required = false, redirectTo } = { ...props };
  const [user, setUser] = useState<DefaultSession["user"] | undefined>();
  const [error, setError] = useState<ResponseError | undefined>();
  const [session] = useSession({
    required,
    redirectTo,
    queryConfig: {
      staleTime: 60 * 1000 * 60 * 3, // 3 hours
      refetchInterval: 60 * 1000 * 5, // 5 minutes
    },
  });

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    }
    if (session?.error) {
        setError(session.error)
    }
  }, [session]);

  return {
    session,
    user,
    error
  }
};
