import express from "express";
import validateBody from "../helpers/validateBody.js";

import { asyncWrapper } from "../helpers/asyncWrapper.js";
import { registerLoginUserSchema } from "../schemasValidation/usersSchema.js";
import { createNewUser, loginUser } from "../controllers/usersControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerLoginUserSchema),
  asyncWrapper(createNewUser)
);

authRouter.post("/login", validateBody(registerLoginUserSchema), asyncWrapper(loginUser));

export default authRouter;
