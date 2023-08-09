import { v4 as uid } from 'uuid'
import NumberFormat from 'react-number-format'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import useDebug from '../../hooks/useDebug'

const {debug} = useDebug('utils')

export const URLify = (content: string) => {
  const urls = content.match(
    /((((ftp|https?):\/\/)|(w{3}\.))[\-\w@:%_\+.~#?,&\/\/=]+)/g
  )
  if (urls) {
    urls.forEach(function (url: string) {
      content = content.replace(
        url,
        '<a target="_blank" href="' + url + '">' + url + "</a>"
      )
    })
  }
  return content.replace("(", "<br/>(")
}

export const now = () => new Date()

export const ymd = (date: Date = now()): string => {
  let year = date.getFullYear()
  let month = (1 + date.getMonth()).toString().padStart(2, "0")
  let day = date.getDate().toString().padStart(2, "0")
  let hour = date.getHours().toString().padStart(2, "0")
  let min = date.getMinutes().toString().padStart(2, "0")
  let sec = date.getSeconds().toString().padStart(2, "0")
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec
}

export const dbDateFormat = 'YYYY-MM-DD HH:mm:ss.sssZ'

export const timeDifference = (from:Date|string) => dayjs(from.toString()).fromNow()

export const dedupe = (arr:any[],key:string) => {
  const a:string[] = [], b:any[] = []
  arr.forEach(i => {
    if (!a.includes(i[key])) {
      a.push(i[key])
      b.push(i)
    }
  })
  return b
}

export const rand = (min: number = 0, max: number = 1) => {
  if (min && !max) {
    max = min + 1
  }
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const randArray = (arr:any[]) => arr[rand(0, arr.length-1)]

export const uuid = (key?:string) => key || uid()

export const uniqueKey = (...items:any) => {
  if (!items) return uuid()
  const key = items.flatMap((item:any) => typeof item === "object" 
    ? `${item?.id || uuid()}`
    : item
    ).join('-')
  return key
}
//TODO document this
export const uniqueArray = (a:string[]) => {
  var seen = {}
  // @ts-ignore
  return a.filter((item) => seen.hasOwnProperty(item) ? false : (seen[item] = true))
}

export const abbrNum = (n: number |Number | null | undefined) => n ? new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(Number(n)) : "0"

//TODO where is this being used?
export function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export  const sleep = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))

export const toSlug = (s: string) =>
  encodeURIComponent(s.replaceAll(/[\W_]+/g, '-').toLowerCase())