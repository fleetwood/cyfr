import { ReactNode } from "react";
import { AudienceLevels, useAudience } from "../../hooks/useAudience";
import useDebug from "../../hooks/useDebug";
const {debug} = useDebug('components/ui/allowContent')

type AllowContentProps = {
  redirect?: string | undefined
  children: ReactNode
  required: AudienceLevels
//   router: NextRouter
}

const AllowContent = ({
//   router,
  required,
  children
}: AllowContentProps) => {
    const {level, hasAccess} = useAudience(required)
  return <>{hasAccess && (children)}</>
};

export default AllowContent
