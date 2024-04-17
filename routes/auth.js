import express from "express";
import validateBody from "../helpers/validateBody.js";

import { asyncWrapper } from "../helpers/asyncWrapper.js";
import { registerLoginUserSchema, subscriptionSchema } from "../schemasValidation/usersSchema.js";
import { createNewUser, getCurrentUserCreds, loginUser, updateUserSubscription } from "../controllers/usersControllers.js";
import { checkAuthenticity, checkAuthenticityAndLogout } from "../midleWare/checkAuthenticity.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerLoginUserSchema),
  asyncWrapper(createNewUser)
);

authRouter.post(
  "/login",
  validateBody(registerLoginUserSchema),
  asyncWrapper(loginUser)
);

authRouter.post(
  "/logout",
  asyncWrapper(checkAuthenticityAndLogout)
);

authRouter.get(
  "/current",
  asyncWrapper(checkAuthenticity),
  asyncWrapper(getCurrentUserCreds)
);

authRouter.patch(
  "/",
  validateBody(subscriptionSchema),
  asyncWrapper(checkAuthenticity),
  asyncWrapper(updateUserSubscription)
);


export default authRouter;
