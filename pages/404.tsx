import {ReactNode} from "react"
import StaticLayout from "../components/layouts/StaticLayout"
import JsonBlock from "../components/ui/jsonBlock"
import useDebug from "../hooks/useDebug"
const {debug} = useDebug('404',)

type ErrorPageProps = {
    error?:     any
    message?:   string
    code?:      string
    variant?:   'page' | 'component'
    children?:  ReactNode
}

const ErrorPage = (props:ErrorPageProps) => {
    const errorMessage = props.error?.message ?? props.message ?? "Ya That's an Error"
    const errorTitle = props.error?.code ?? props.code ?? '404'
    const MoreInfo = () => <>{props.children ?? props.message ? props.message : <><h3>404 or smth</h3><p>Weird.</p></>}</>

    return props.variant === 'page' ? (
      <StaticLayout pageTitle={errorTitle} sectionTitle={errorTitle} subTitle={errorMessage}>
        <MoreInfo />
        <JsonBlock data={props} />
      </StaticLayout>
    )
    : (
      <>
        <MoreInfo />
        <JsonBlock data={props} />
      </>
    )
}
export default ErrorPage  