import { __prod__ } from "./constants";

export const log = (message?: any, ...optionalParams: any[]) => {
  if (!__prod__) {
    if (optionalParams && "string" === typeof optionalParams[0]) {
      console.log(message + " " + optionalParams);
    } else if (optionalParams && optionalParams.length > 0) {
      console.log(message, JSON.stringify(optionalParams.map((o) => o), null, 2));
    } else {
      console.log(message);
    }
  }
};

export const logError = (message?: any, ...optionalParams: any[]) => {
  if (!__prod__) {
    console.error(message, optionalParams);
  }
};

export const todo = (...params: any) => log(`!!!TODO!!!`, ...params);