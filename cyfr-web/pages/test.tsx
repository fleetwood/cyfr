import React, { useEffect, useState } from "react";
import RemirrorEditor from "../components/ui/RemirrorEditor";
import StaticLayout from './../components/layouts/StaticLayout'

const Test = () => {
  const [message, setMessage] = useState<string|null>("<p>This is the default message</p>");

  function handleSubmit(e:any) {
    e.preventDefault();
    setMessage("");
  }

  return (
    <StaticLayout sectionTitle="Remirror" >
      <RemirrorEditor content={message} setContent={setMessage} />
      <div className="mt-2 p-2 font-ibarra">{message}</div>
    </StaticLayout>
  );
};

export default Test;