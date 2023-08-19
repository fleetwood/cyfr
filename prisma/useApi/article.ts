import {Article, ArticleType} from "@prisma/client"
import useDebug from "hooks/useDebug"
import {ArticleStub} from "prisma/types"
import {NotImplemented, getApi} from "utils/api"

const { debug, fileMethod } = useDebug("hooks/useArticleApi", )
const noArticleDetail = (method: string) => {debug(method, "articleDetail is null");return false}

type ArticleQueryProps = {
    articleId?:     string
    articleSlug?:   string
}

const useArticleApi = () => {
    const query = ({articleId, articleSlug}:ArticleQueryProps) => articleId ? detailById(articleId) : detailBySlug(articleSlug!)
    
    const detailById = (id:string):Article => {throw NotImplemented()}
    const detailBySlug = (slug:string):Article => {throw NotImplemented()}
 
    const feed = async ({type, take=10, skip=0}:{type?:ArticleType, take?:number, skip?:number}):Promise<ArticleStub[]> => await getApi(`articles/feed${type?`?t=`+type:''}`)

    return {
        query,
        detailById,
        detailBySlug,
        feed
    }
}
  export default useArticleApi