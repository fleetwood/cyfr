import { BookDetail } from "../prisma/prismaContext"
import useDebug from "./useDebug"
import { sendApi } from "../utils/api"

const {debug} = useDebug('hooks/useBookApi','DEBUG')

const useBookApi = (book:BookDetail) => {
  
  const follow = async (followerId:string, isFan=false) => {
    const upsert = await (await sendApi("book/follow", {
        bookId: book.id,
        followerId,
        isFan
    })).data
    if (upsert.result) {
        return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }

  const like = async (userId:string) => {
    const upsert = await (await sendApi("book/like", {
        bookId: book.id,
        authorId: userId
    })).data
    if (upsert.result) {
        return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }
  
  const share = (userId:string) => {
    throw new Error('Not implemented')
  }
  
  const upsert = async (book:BookDetail) => {
    const upsert = await (await sendApi("book/upsert", book)).data
    if (upsert.result) {
        return true
    }
    else {
        debug('Did not get right result?', upsert.result)
        return false
    }
  }

  return {
    follow,
    like,
    share,
    upsert
  }
}

export default useBookApi