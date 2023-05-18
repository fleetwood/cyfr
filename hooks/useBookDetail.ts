
import { useQuery, useQueryClient } from "react-query"
import { BookDetail, BookDetailHook, BookDetailState, BookStatus, CyfrUser } from "../prisma/prismaContext"
import { getApi } from "../utils/api"
import { now } from "../utils/helpers"
import useDebug from "./useDebug"
import { useState } from "react"
import BookApi from "../prisma/api/book"

const { debug, info } = useDebug("BookDetailProvider")

const useBookDetail = (bookId:string, cyfrUser:CyfrUser) => {
  const qc = useQueryClient()
  const getBookDetail = async () => {
    if (!bookId) return null
    const bookDetail = await getApi(`/book/${bookId}`)
    return (bookDetail.result as BookDetail) || bookDetail.error || null
  }

  const [bookDetail, setBookDetail] = useState<BookDetail|null>(null)

  // // STATE
  // id: string;
  const id = bookDetail?.id
  // createdAt: Date;
  const createdAt = bookDetail?.createdAt?.toString() ?? ''
  // updatedAt: Date;
  const [updatedAt, setUpdatedAt] = useState<string>(now.toString())
  // startedAt: Date | null;
  const [startedAt, setStartedAt] = useState<string>((bookDetail?.startedAt??now).toString())
  // completeAt: Date | null;
  const [completeAt, setCompleteAt] = useState<string>(bookDetail?.completeAt?.toString()??'')
  // active: boolean;
  const [active, setActive] = useState<boolean>((bookDetail?.active??false))
  // status: BookStatus | null;
  const [status, setStatus] = useState<BookStatus>(bookDetail?.status??'DRAFT')
  // prospect: boolean;
  const [prospect, setProspect] = useState<boolean>(bookDetail?.prospect??true)
  // fiction: boolean;
  const [fiction, setFiction] = useState<boolean>(bookDetail?.fiction??true)
  // title: string;
  const [title, setTitle] = useState<string>(bookDetail?.title??'')
  // slug: string;
  const [slug, setSlug] = useState<string>(bookDetail?.slug??'')
  // coverId: string | null;
  const [coverId, setCoverId] = useState<string>(bookDetail?.coverId??'')
  // genreId: string;
  const [genreId, setGenreId] = useState<string>(bookDetail?.genreId??'')
  // hook: string | null;
  const [hook, setHook] = useState<string>(bookDetail?.hook??'')
  // synopsis: string | null;
  const [synopsis, setSynopsis] = useState<string>(bookDetail?.synopsis??'')
  // back: string | null;
  const [back, setBack] = useState<string>(bookDetail?.back??'')
  // words: number;// back: string | null;
  const [words, setWords] = useState<number>(bookDetail?.words??0)
  // galleryId: string | null;
  const [galleryId, setGalleryId] = useState<string>(bookDetail?.galleryId??'')

  // RELATIONS
  // Read-only
  const { genre, gallery, authors, cover, follows, likes, shares, chapters, characters, categories } = bookDetail??{}

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>()
  const api = BookApi(bookDetail)

  const by = (bookDetail?.authors??[]).flatMap(author => author.name).join(' and ')
  const notEmpty = (arr: Array<any> | undefined | null) => arr !== undefined && arr !== null && arr.length > 0
  
  //todo: This should be handled by a commune...
  const isAuthor = cyfrUser ? (bookDetail?.authors??[]).filter(a => a.id === cyfrUser?.id).length > 0 : false

  const current:BookDetail = {
    id: id!,
    createdAt: new Date(createdAt!),
    updatedAt: new Date(updatedAt!),
    startedAt: startedAt ? new Date(startedAt) : null,
    completeAt: startedAt ? new Date(startedAt) : null,
    active,
    status,
    prospect,
    fiction,
    title,
    back,
    hook,
    synopsis,
    slug,
    words,
    coverId,
    genreId,
    galleryId,
    genre: genre!, 
    authors: authors!, 
    gallery, cover, follows, likes, shares, chapters, characters, categories
  }

  const invalidate = () => {
    info('invalidate',["bookDetail", bookId])
    qc.invalidateQueries(["bookDetail", bookId])
  }

  const query = useQuery(
    ["bookDetail", bookId],
    getBookDetail,
    {
      onSettled(data: any,error: any) {
        setIsLoading(false)
        if (error || data === null) {
          info(`onSettled ${["bookDetail", bookId]} ERROR`, { error, data })
          setError(error)
        }
        if (data) {
          debug(`onSettled`, data)
            setBookDetail(data)
        }
      }
    }
  )

  return {
    bookDetail,
    api,
    query: {
      error, 
      isLoading,
      invalidate
    },
    // pass-thru properties
    state: {
      current,
      id, createdAt, 
      updatedAt, setUpdatedAt,
      startedAt, setStartedAt,
      completeAt, setCompleteAt,
      active, setActive,
      status, setStatus,
      prospect, setProspect,
      fiction, setFiction,
      title, setTitle,
      back, setBack,
      hook, setHook,
      synopsis, setSynopsis,
      slug, setSlug,
      // RELATIONS
      coverId, setCoverId,
      genreId, setGenreId,
      galleryId, setGalleryId,
      isAuthor
    } as BookDetailState,
    // relations
    relations: {
      genre, gallery, authors, cover, follows, likes, shares, chapters, characters, categories
    }
  } as BookDetailHook
}

export default useBookDetail