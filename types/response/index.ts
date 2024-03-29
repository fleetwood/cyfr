export type ResponseError = {
  code: string;
  message: string;
};

export type ResponseResult<T> = {
  error?: ResponseError | undefined;
  result?: T | undefined;
};

export const ResponseErrorList = {
  notifyLoginRequired: {
    code: "auth/no-user-session",
    message: "Please login to continue",
  },
  wrongPassword: {
    code: "auth/wrong-password",
    message: "Password incorrect",
  },
  userNotFound: {
    code: "auth/user-not-found",
    message: "User not found",
  },
  loginSubmit: {
    code: "auth/login-submit-handler",
    message: "Login hook exception",
  },
  registerSubmit: {
    code: "auth/register-submit-handler",
    message: "Registration failed",
  },
  duplicateUser: {
    code: "auth/email-already-in-use",
    message: "Unable to complete registration",
  },
  weakPassword: {
    code: "auth/weak-password",
    message: " Password must be at least 6 characters",
  },
  postNotfound: {
    code: "api/post-not-found",
    message: "Post not found",
  },
  generic: {
    code: "unknown",
    message: "An unknown error has ocurred",
  },
};

export const GetResponseError = (error?: any, defaultTo?: ResponseError) => {
  try {
    const e = Object.values(ResponseErrorList).filter(
      (e) => JSON.stringify(e).indexOf(error.code) >= 0
    )[0];
    if (e) return e;
  } catch (e) {}

  return defaultTo || ResponseErrorList.generic;
};

type GenericResponseErrorType = {
  error?: ResponseError
  message?: string
  code?: string
}
export const GenericResponseError = ({message, code, error}:GenericResponseErrorType):ResponseError => {
  return error?.message ? 
        {
          message: error.message,
          code: error.code || ResponseErrorList.generic.code
        } 
        : message ? 
        {
          message,
          code: code || ResponseErrorList.generic.code
        }
        : ResponseErrorList.generic
}
