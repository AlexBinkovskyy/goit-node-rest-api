import HttpError from "../helpers/HttpError.js";

export const checkEmptyUpdtObj = (obj, next) => {
  if (!Object.keys(obj).length) {
    next(HttpError(400, "Body must have at least one field"));
    return;
  }
};
