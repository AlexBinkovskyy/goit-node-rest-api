import express from "express";
import validateBody from "../helpers/validateBody.js";

import { asyncWrapper } from "../helpers/asyncWrapper.js";
import { registerLoginUserSchema, subscriptionSchema } from "../schemasValidation/usersSchema.js";
import { createNewUser, getCurrentUserCreds, loginUser, updateUserSubscription } from "../controllers/usersControllers.js";
import { checkAuthenticity, checkAuthenticityAndLogout } from "../midleWare/checkAuthenticity.js";
import { upload } from "../midleWare/fileHandlerMdlWare.js";

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

authRouter.post(
  "/avatars", upload.single('avatar'), async (req, res) => {
    console.log(req.file);
  });


export default authRouter;
