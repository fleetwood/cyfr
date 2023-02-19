// @ts-nocheck
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import TailwindInput from "../components/forms/TailwindInput";
import TailwindTextarea from "../components/forms/TailwindTextarea";
import { getApi, SocketListeners } from "../utils/api";
import StaticLayout from './../components/layouts/StaticLayout'

let socket;

const Test = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    socketInitializer();

    return () => {
      socket.disconnect();
    };
  }, []);

  async function socketInitializer() {
    await getApi("socket");

    socket = io();

    socket.on(SocketListeners.notification.listen, (data) => {
      setAllMessages((pre) => [...pre, data]);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("emitted");

    socket.emit(SocketListeners.notification.send, {
      username,
      message
    });
    setMessage("");
  }

  return (
    <StaticLayout sectionTitle="Chat App" >

      <div className="flex justify-between">
        <div>
          <TailwindInput type="text"
            placeholder="name pls" 
            label="What is your name?"
            value={username}
            setValue={setUsername} />

          <form onSubmit={handleSubmit}>
            <TailwindTextarea
              label="What is your Quest?"
              placeholder="enter your message"
              inputClassName="border border-secondary-content bg-secondary text-base-100 rounded-lg"
              value={message}
              setValue={setMessage}
              />
            <button className="btn btn-primary" type="submit">Send!!</button>
          </form>
        </div>
        <div className="flex flex-col space-y-2">
          {allMessages.map(({ username, message }, index) => (
            <div key={index} className="bg-primary text-primary-content even:bg-opacity-30 odd:bg-opacity-20 p-4 rounded-lg">
              <b>{username}</b>: {message}
            </div>
          ))}
        </div>
      </div>
    </StaticLayout>
  );
};

export default Test;