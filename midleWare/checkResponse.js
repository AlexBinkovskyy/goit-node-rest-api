import HttpError from "../helpers/HttpError.js";

export const checkResponse = (data, next) => {
  if (!data) {
    next(HttpError(404));
    return;
  }
 };
