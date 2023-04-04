import router, { NextRouter, useRouter } from "next/router";
import { ReactNode } from "react";
import useDebug from "../../hooks/useDebug";
import { AccessProps, canAccess } from "../../prisma/types";
const {debug} = useDebug('components/ui/allowContent', 'DEBUG')

type AllowContentProps = AccessProps & {
  redirect?: string | undefined
  children: ReactNode
//   router: NextRouter
};

const AllowContent = ({
//   router,
  required,
  redirect,
  cyfrUser,
  children
}: AllowContentProps) => {
  const allow = canAccess({ required, cyfrUser })
  const router = useRouter()
  debug('if allowed', {required, level: cyfrUser?.membership?.level, allow, redirect})
  if (!allow && redirect !== undefined) {
    router.push(redirect)
  }

  return <>{allow && (children)}</>
};

export default AllowContent;
