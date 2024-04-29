import HttpError from "../helpers/HttpError.js";
import {
  changeVerificationCreds,
  checkUserByEmail,
  checkUserCreds,
  createUser,
  emailService,
  findVerifiedToken,
  login,
  updateSubscription,
} from "../helpers/userServices.js";

export const createNewUser = async (req, res, next) => {
  if (await checkUserByEmail(req.body))
    throw HttpError(409, "Current email already in use");
  req.body = await createUser(req.body);
  req.user = "new";
  next();
};

export const loginUser = async (req, res, next) => {
  const user = await checkUserCreds(req.body);
  if (!user) throw HttpError(401, "Email or password is wrong or not verified");
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

export const sendVerificationEmail = async (req, res, next) => {
  const user = await checkUserByEmail(req.body);

  if (!user) throw HttpError(404, "User not found");
  if (!user.email) throw HttpError(400, "missing required field email");
  if (user.verify) throw HttpError(400, "Verification has already been passed");

  await emailService(user);
  if (req.user === "new") {
    res.status(201).json({
      user: {
        email: req.body.email,
        subscription: req.body.subscription,
        message: "Verification email sent",
      },
    });
  } else {
    res.status(201).json({
      message: "Verification email sent",
    });
  }
};

export const verificationTokenCheck = async (req, res, next) => {
  const checkToken = await findVerifiedToken(req.params.verificationToken);
  if (!checkToken) throw HttpError(404, "User not found");
  changeVerificationCreds(checkToken);
  res.status(200).json({ message: "Verification successful" });
};
