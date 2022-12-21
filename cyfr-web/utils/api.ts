import { __host__, __port__ } from "./constants";
import { jsonify, log } from "./log";
import axios from 'axios'

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

export const getApi = async (url: string):Promise<any> => parseResponse((await axios.get(apiUrl(url))).data)

export const sendApi = async (url: string, data: any, invalidate = false) => {
  const sendTo = apiUrl(url),
    post = postData(data);
  log("sendApi", sendTo, post);
  return axios.post(sendTo,post)
};

export const parseResponse = (response: any) => {
  return JSON.parse(jsonify(response));
};
