import React, { useEffect, useState } from "react";
import RemirrorEditor from "../components/ui/RemirrorEditor";
import StaticLayout from './../components/layouts/StaticLayout'

const Test = () => {
  const [message, setMessage] = useState("");

  function handleSubmit(e:any) {
    e.preventDefault();
    setMessage("");
  }

  return (
    <StaticLayout sectionTitle="Remirror" >
      <RemirrorEditor />
    </StaticLayout>
  );
};

export default Test;