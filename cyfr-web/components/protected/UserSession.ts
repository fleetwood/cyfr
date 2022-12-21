import { useSession } from "../../lib/next-auth-react-query";
import { Users } from "../../prisma/users";

export const UserSession = async (props?: {
  required: boolean | undefined;
  redirectTo: string | undefined;
  setUser: Function;
  setError: Function;
}) => {
  const { required = false, redirectTo, setUser } = { ...props };
  const [session] = useSession({
    required,
    redirectTo,
    queryConfig: {
      staleTime: 60 * 1000 * 60 * 3, // 3 hours
      refetchInterval: 60 * 1000 * 5, // 5 minutes
    },
  });

  if (session?.user) {
    const getUser = await Users.byEmail(session.user.email);
    if (getUser.result) {
      setUser!(getUser.result);
    }
  }
};
