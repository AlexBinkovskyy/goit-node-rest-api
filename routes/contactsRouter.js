import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { asyncWrapper } from "../helpers/asyncWrapper.js";

const contactsRouter = express.Router();

contactsRouter.get("/", asyncWrapper(getAllContacts));

contactsRouter.get("/:id", asyncWrapper(getOneContact));

contactsRouter.delete("/:id", asyncWrapper(deleteContact));

contactsRouter.post("/", validateBody(createContactSchema), asyncWrapper(createContact));

contactsRouter.put("/:id", validateBody(updateContactSchema), asyncWrapper(updateContact));

export default contactsRouter;
