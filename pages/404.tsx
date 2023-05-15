import StaticLayout from "../components/layouts/StaticLayout"
import JsonBlock from "../components/ui/jsonBlock"
import useDebug from "../hooks/useDebug"
const {debug} = useDebug('404','DEBUG')

type ErrorPageProps = {
    error?:     any
    message?:   string
    code?:      string
}

const ErrorPage = (props:ErrorPageProps) => {
    const errorMessage = props.error?.message ?? props.message ?? "Ya That's an Error"
    const errorTitle = props.error?.code ?? props.code ?? '404'
    const MoreInfo = () => <>{props.message ? props.message : <><h3>404 or smth</h3><p>Weird.</p></>}</>

    return (
    <StaticLayout pageTitle={errorTitle} sectionTitle={errorTitle} subTitle={errorMessage}>
      <MoreInfo />
      <JsonBlock data={props} />
    </StaticLayout>
  )}
export default ErrorPage  