import { ReactNode } from "react";
import SectionTitle from "./sectionTitle";

type SectionProps = {
  sectionTitle: String;
  subTitle?: String;
  children: ReactNode;
};

const Section = ({ sectionTitle, subTitle, children }: SectionProps) => {
  return (
    <section>
      <div className="col-span-3 mx-auto max-w-5xl py-8 md:py-16">
        <SectionTitle title={sectionTitle} subTitle={subTitle} />
      </div>
      <div className="mx-auto max-w-5xl px-8 lg:px-0">{children}</div>
    </section>
  );
};

export default Section;
