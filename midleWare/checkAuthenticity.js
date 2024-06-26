import HttpError from "../helpers/HttpError.js";
import {
  checkTokenPlusUser,
  deleteTokenFromUser,
  verifyToken,
} from "../helpers/userServices.js";

export const checkAuthenticity = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") next(HttpError(401, "Not authorized"));
  try {
    const { id } = await verifyToken(token);
    const user = await checkTokenPlusUser(id, token);
    if (!user) throw HttpError(401, "Not authorized");
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export const checkAuthenticityAndLogout = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") next(HttpError(401));
  try {
    const { id } = await verifyToken(token);
    const user = await checkTokenPlusUser(id, token);
    if (!user) throw HttpError(401, "Not authorized");
    if (!(await deleteTokenFromUser(user))) next(HttpError(500));
    res.status(204).end();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};
