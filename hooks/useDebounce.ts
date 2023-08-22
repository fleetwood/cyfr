import React, { useEffect, useState } from 'react'

const useDebounce = <T>({ value, ms }: { value: T; ms: number }) => {
  const [val, setVal] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => { setVal(value) }, ms)
    return () => clearTimeout(handler)
  }, [value, ms])
  return val
}

export default useDebounce
