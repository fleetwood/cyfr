import React from "react"
import NumberFormat from "react-number-format"

// @ts-ignore
const AbbrNum = (n:number|null|undefined) => <NumberFormat value={n ?? 0} displayType={"text"} format={"0.0a"} />

export default AbbrNum