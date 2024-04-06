import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contact.js";
import mongoose from "mongoose";

export const checkIsValidId = () => {
  const func = async (req, res, next) => {
    const { contactId } = req.params;
    if (!contactId || !mongoose.Types.ObjectId.isValid(contactId)) {
      next(HttpError(404, 'Invalid ID or Not found'));
      return;
    }
    try {
      const result = await Contact.findById(contactId);
      if (!result) {
        next(HttpError(404));
        return;
      }
    } catch (error) {
      next(HttpError(400, error.message));
      return;
    }
    next();
  };

  return func;
};
