import HttpError from "../helpers/HttpError.js";
import { checkUserByEmail, createUser } from "../helpers/userServices.js";

export const createNewUser = async (req, res, next) => {
  if (await checkUserByEmail(req.body.email))
    throw HttpError(409, "Current email already in use");
  const newUser = await createUser(req.body);
  res.status(201).json({ user: {
    email: newUser.email,
    subscription: newUser.subscription
  } });
};
