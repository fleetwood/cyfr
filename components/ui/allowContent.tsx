import { useRouter } from "next/router"
import ErrorPage from "pages/404"
import { ReactNode } from "react"
import useDebug from "../../hooks/useDebug"
import useApi from "prisma/useApi"
const {debug} = useDebug('components/ui/allowContent')

type AllowContentProps = {
  redirect?: string | undefined
  children: ReactNode
  required: any //Audience
}

const AllowContent = ({redirect,required,children}: AllowContentProps) => {
  const {cyfrUser} = useApi.cyfrUser()
  const level = cyfrUser?.membership?.type?.level ?? null
  const allowed = level !== null

  if (allowed) {
    return (<>{children}</>)
  }
  if (redirect) {
    const router = useRouter()
    router.push(redirect)
  }
  return <ErrorPage message="You do not have permission to view this content." />
}

export default AllowContent
