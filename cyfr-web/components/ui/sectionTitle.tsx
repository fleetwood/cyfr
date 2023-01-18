import React, { ReactNode } from "react"

type sectionTitlePropTypes = {
  title: String | ReactNode
  subTitle?: String
}

const SectionTitle = (props: sectionTitlePropTypes) => {
  const { title, subTitle } = props
  return (
    <>
      <h1 className="h-title">
        {title}
      </h1>
      {subTitle && <h1 className="h-subtitle">{subTitle}</h1>}
    </>
  )
}

export default SectionTitle
