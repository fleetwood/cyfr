import {SpinnerEllipse} from 'components/ui/spinnerEllipse'
import useDebug from 'hooks/useDebug'
import {CoverStub} from 'prisma/prismaContext'
import useCoverApi from 'prisma/useApi/cover'
import {useEffect,useState} from 'react'
import CoverStubView from './CoverStubView'
const{ debug} = useDebug('containers/Cover/CoverDefault')
type CoverDefaultProps = {
    height:     number
    onSelect?: (cover:CoverStub) => any
}

const defaultCover = `clkkp3ax4000gmp0h0tp7j9hv`

const CoverDefault = ({height, onSelect}:CoverDefaultProps) => {
    const {stub} = useCoverApi()
    const [cover, setCover] = useState<CoverStub>()

    const getCover = async () => {
        debug('getCover', defaultCover)
        const c = await stub(defaultCover)
        if (c) {
            debug('settingCover', c)
            setCover(() => c)
        }
    }

    useEffect(() => {
        debug('useEffect')
        getCover()
    }, [])

    return (
        cover ? <CoverStubView cover={cover} height={height} onSelect={onSelect} /> : <SpinnerEllipse />
)}

export default CoverDefault