import express from "express";
import validateBody from "../helpers/validateBody.js";

import { asyncWrapper } from "../helpers/asyncWrapper.js";
import {
  registerLoginUserSchema,
  resendEmailSchema,
  subscriptionSchema,
} from "../schemasValidation/usersSchema.js";
import {
  createNewUser,
  getCurrentUserCreds,
  loginUser,
  sendVerificationEmail,
  updateUserSubscription,
  verificationTokenCheck,
} from "../controllers/usersControllers.js";
import {
  checkAuthenticity,
  checkAuthenticityAndLogout,
} from "../midleWare/checkAuthenticity.js";
import {
  checkOldAvatar,
  makeImagePublic,
  processImage,
  upload,
} from "../midleWare/fileHandlerMdlWare.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerLoginUserSchema),
  asyncWrapper(createNewUser),
  asyncWrapper(sendVerificationEmail)
);

authRouter.post(
  "/login",
  validateBody(registerLoginUserSchema),
  asyncWrapper(loginUser)
);

authRouter.post("/logout", asyncWrapper(checkAuthenticityAndLogout));

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

authRouter.patch(
  "/avatars",
  asyncWrapper(checkAuthenticity),
  asyncWrapper(checkOldAvatar),
  upload.single("avatar"),
  asyncWrapper(processImage),
  asyncWrapper(makeImagePublic)
);

authRouter.get(
  "/verify/:verificationToken",
  asyncWrapper(verificationTokenCheck)
);

authRouter.post(
  "/verify",
  validateBody(resendEmailSchema),
  asyncWrapper(sendVerificationEmail)
  // asyncWrapper(verificationTokenCheck)
);

export default authRouter;
