import { ReactNode } from "react";
import SectionTitle from "./sectionTitle";

type SectionProps = {
  sectionTitle: string;
  subTitle?: string | null;
  className?: string | null;
  children: ReactNode;
};

const Section = ({ sectionTitle, children, ...props }: SectionProps) => {
  return (
    <section className={props.className || ""}>
      <div className="col-span-3 mx-auto max-w-5xl py-8 md:py-16">
        <SectionTitle
          title={sectionTitle}
          subTitle={props.subTitle ? props.subTitle : undefined}
        />
      </div>
      <div className="mx-auto max-w-5xl px-8 lg:px-0">{children}</div>
    </section>
  );
};

export default Section;
