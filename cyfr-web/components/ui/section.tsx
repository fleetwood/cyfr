import { ReactNode } from "react"
import SectionTitle from "./sectionTitle"
import { classNameProps } from "../../types/props"

type SectionProps = classNameProps  & {
  sectionTitle?: string | ReactNode
  subTitle?: string | null
  children: ReactNode
}

const Section = ({ children, ...props }: SectionProps) => {
  return (
    <section className={props.className || ''}>
      <div className="col-span-3 mx-auto max-w-5xl py-8 md:py-16">
        <SectionTitle
          title={props.sectionTitle}
          subTitle={props.subTitle ? props.subTitle : undefined}
        />
      </div>
      <div className="mx-auto max-w-5xl px-8 lg:px-0">{children}</div>
    </section>
  )
}

export default Section
