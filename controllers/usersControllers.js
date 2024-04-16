import HttpError from "../helpers/HttpError.js";
import {
  checkUserByEmail,
  checkUserCreds,
  createUser,
  getUserById,
  login,
} from "../helpers/userServices.js";

export const createNewUser = async (req, res, next) => {
  if (await checkUserByEmail(req.body))
    throw HttpError(409, "Current email already in use");
  const newUser = await createUser(req.body);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

export const loginUser = async (req, res, next) => {
  const user = await checkUserCreds(req.body);
  if (!user) throw HttpError(401, "Email or password is wrong");
  const loggedUser = await login(user);
  res.status(200).json({
    token: loggedUser.token,
    user: {
      email: loggedUser.email,
      subscription: loggedUser.subscription,
    },
  });
};

export const getCurrentUserCreds = async (req, res, next) => {
  const user = await getUserById(req.user.id);
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};
