import { UpsertInboxProps } from 'prisma/prismaContext'
import { sendApi } from 'utils/api'

const useInboxApi = () => { 
    
    const sendMessage = async (props:UpsertInboxProps) => await sendApi('user/inbox/send', props)

}

export default useInboxApi