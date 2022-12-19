import { __host__, __port__ } from "./constants";
import useSWR from "swr";
import { log } from "./log";

const apiUrl = (url: string) => `http://${__host__}:${__port__}/api/${url}`;
const postData = (data: any) => {
  return {
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  };
};

const fetcher = async (url: any) =>
  fetch(url).then((results) => results.json());

export const getApi = async (url: string, invalidate = false) => {
  return await (await fetch(apiUrl(url))).json();
};

export const sendApi = async (url: string, data: any, invalidate = false) => {
  const sendTo = apiUrl(url),
    post = postData(data);
  log("sendApi", sendTo, post);
  return await (await fetch(sendTo, post)).json();
};
