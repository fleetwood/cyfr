// @ts-nocheck
import React, { useEffect, useState } from "react";
import SimpleQuill from "../components/ui/SimpleQuill";
import StaticLayout from './../components/layouts/StaticLayout'

const Test = () => {
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
  }

  return (
    <StaticLayout sectionTitle="Quill" >
      <SimpleQuill className="w-full" content={message} setContent={setMessage} />
    </StaticLayout>
  );
};

export default Test;