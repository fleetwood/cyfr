import { __host__, __port__ } from "./constants";
import { jsonify, log } from "./log";
import axios from "axios";

export const apiUrl = (url: string) =>
  `http://${__host__}:${__port__}/api/${url}`;

const postData = (body: any) => {
  return {
    body,
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  };
};

const fetcher = async (url: any) =>
  fetch(url).then((results) => results.json());

export const parseResponse = (response: any) => 
  JSON.parse(JSON.stringify(response))

export const getApi = async <T> (url: string): Promise<T|any> => {
  return parseResponse((await axios.get(apiUrl(url))).data);
};

export const sendApi = async (url: string, body: any) => {
  const sendTo = apiUrl(url);
  const post = postData(body)
  return axios.post(sendTo, post);
};
