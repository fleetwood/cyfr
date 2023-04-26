import { v4 as uid } from 'uuid'
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

//TODO this can be cleaned up a bit
const isOne = (num: number, label: string) =>
  num !== 1 ? `${num} ${label}s ago` : `${num} ${label} ago`

const dayOf = (day: any) => {
  switch (day) {
    case 7:
      return "Sat"
    case 6:
      return "Fri"
    case 5:
      return "Thu"
    case 4:
      return "Wed"
    case 3:
      return "Tue"
    case 2:
      return "Mon"
    default:
      return "Sun"
  }
}

const monthOf = (month: any) => {
  switch (month) {
    case 11:
      return "Dec"
    case 10:
      return "Nov"
    case 9:
      return "Oct"
    case 8:
      return "Sep"
    case 7:
      return "Aug"
    case 6:
      return "Jul"
    case 5:
      return "Jun"
    case 4:
      return "May"
    case 3:
      return "Apr"
    case 2:
      return "Mar"
    case 1:
      return "Feb"
    default:
      return "Jan"
  }
}

export const timeDifference = (from:Date|string) => {
  if (from === null) {
    debug('timeDifference', {message: 'from is null?', from})
    return ''
  }
  const fromDate = (typeof Date === from ? from : new Date(from)) as Date
  const datetime = fromDate.getTime()
  const current = now().getTime()
  if (isNaN(datetime)) {
    debug('timeDifference', {message: 'from is NAN?', from, fromDate, datetime, current})
    return ""
  }
  const milisec_diff = current - datetime
  var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24))
  var date_diff = new Date(milisec_diff)
  const ago = {
    weeks: Math.floor(days / 7),
    days,
    hours: date_diff.getHours(),
    minutes: date_diff.getMinutes(),
  }
  if (ago.weeks > 3) {
    return `${fromDate.getFullYear()}, ${monthOf(fromDate.getMonth())} ${fromDate.getDate() > 9 ? fromDate.getDate() : "0" + fromDate.getDate()}`
  } else if (ago.weeks > 0) {
    return isOne(ago.weeks, " week")
  } else if (ago.days > 0) {
    return isOne(ago.days, " day")
  } else if (ago.hours > 0) {
    return isOne(ago.hours, " hour")
  } else if (ago.minutes >= 2) {
    return ago.minutes + " minutes ago"
  } else {
    return "Just now"
  }
}

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
  var seen = {};
  // @ts-ignore
  return a.filter((item) => seen.hasOwnProperty(item) ? false : (seen[item] = true));
}

export const valToLabel = (val: number) => {
  let result = val.toString()
  const tolerances: Array<{ x: number, l: string, d: number, p: number }> = [
    { x: 1000000, l: "M", d: 1000000, p: 2 },
    { x: 10000, l: "K", d: 1000, p: 3 },
    { x: 1000, l: "K", d: 1000, p: 2 },
  ]
  tolerances.every((t) => {
    if (val >= t.x) {
      result = (Math.round(val) / t.d).toPrecision(t.p).toString()
      result += t.l
      return false
    }
    return true
  })
  return result
}
//TODO where is this being used?
export function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}
