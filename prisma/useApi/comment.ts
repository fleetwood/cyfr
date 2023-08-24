import { AddCommentProps } from 'prisma/prismaContext'
import { sendApi } from 'utils/api'

const useCommentApi = () => { 
    
    const addComment = async (props:AddCommentProps) => await sendApi('comment/add', props)

    return {
        addComment
    }
}

export default useCommentApi