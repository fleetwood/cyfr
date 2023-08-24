import React from "react"
import JSONPretty from "react-json-pretty"
import { __logLevel__ } from "../../utils/constants"

const adventureTme = require("react-json-pretty/dist/adventure_time")
const leet = require("react-json-pretty/dist/1337")
const acai = require("react-json-pretty/dist/acai")
const mono = require("react-json-pretty/dist/monikai")

type jsonBlockProps = {
  data: any
  theme?: "adventure" | "leet" | "acai" | "mono"
  debug?: boolean
}

const JsonBlock = ({ data, theme, debug = false }: jsonBlockProps) => {
  if (!debug && __logLevel__ !== "DEBUG") return <></>
  const useTheme =
    theme === "adventure" ? adventureTme
    : theme === "leet" ? leet 
    : theme === "acai" ? acai
    : mono
  return <JSONPretty data={data} theme={useTheme} />
}

export default JsonBlock