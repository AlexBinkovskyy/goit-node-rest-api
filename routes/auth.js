import express from "express";
import validateBody from "../helpers/validateBody.js";
import { registerUserSchema } from "../schemasValidation/usersSchema.js";
import { asyncWrapper } from "../helpers/asyncWrapper.js";
import { createNewUser } from "../controllers/usersControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerUserSchema), asyncWrapper(createNewUser) )

export default authRouter;