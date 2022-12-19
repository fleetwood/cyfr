import React from "react";

type sectionTitlePropTypes = {
  title: String;
  subTitle?: String;
};

const SectionTitle = (props: sectionTitlePropTypes) => {
  const { title, subTitle } = props;
  return (
    <>
    <h1 className="h-title">
        {title}
    </h1>
    {subTitle && (
      <h1 className="h-subtitle">
        {subTitle}
      </h1>
    )}
    </>
  );
};

export default SectionTitle;
