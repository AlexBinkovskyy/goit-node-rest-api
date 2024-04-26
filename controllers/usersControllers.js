import HttpError from "../helpers/HttpError.js";
import {
  changeVerificationCreds,
  checkUserByEmail,
  checkUserCreds,
  createUser,
  findVerifiedToken,
  login,
  updateSubscription,
} from "../helpers/userServices.js";

export const createNewUser = async (req, res, next) => {
  if (await checkUserByEmail(req.body))
    throw HttpError(409, "Current email already in use");
  const newUser = await createUser(req.body);
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      message: "Verification code was sent to your registration email",
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
  res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

export const updateUserSubscription = async (req, res, next) => {
  const { _id } = req.user;
  req.user.subscription = req.body.subscription;
  const updatedUser = await updateSubscription(_id, {
    subscription: req.user.subscription,
  });
  res.status(200).json(updatedUser);
};

export const verificationTokenCheck = async (req, res, next) => {
  const checkToken = await findVerifiedToken(req.params.verificationToken);
  if (!checkToken) throw HttpError(404);
  changeVerificationCreds(checkToken);
  res.status(200).json({message: 'Verification successful'})
};
