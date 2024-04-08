import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  updateFavStatusSchema,
} from "../schemas/contactsSchemas.js";
import { asyncWrapper } from "../helpers/asyncWrapper.js";
import { checkIsValidId } from "../midleWare/checkIsValidId.js";
const contactsRouter = express.Router();

contactsRouter.get("/", asyncWrapper(getAllContacts));

contactsRouter.get("/:contactId",checkIsValidId(), asyncWrapper(getOneContact));

contactsRouter.delete("/:contactId",checkIsValidId(), asyncWrapper(deleteContact));

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  asyncWrapper(createContact)
);

contactsRouter.put(
  "/:contactId",
  checkIsValidId(),
  validateBody(updateContactSchema),
  asyncWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  checkIsValidId(),
  validateBody(updateFavStatusSchema),
  asyncWrapper(updateStatusContact)
);

export default contactsRouter;
