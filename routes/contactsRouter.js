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
} from "../schemasValidation/contactsSchemas.js";
import { asyncWrapper } from "../helpers/asyncWrapper.js";
import { checkIsValidId } from "../midleWare/checkIsValidId.js";
import { checkAuthenticity } from "../midleWare/checkAuthenticity.js";
const contactsRouter = express.Router();

contactsRouter.get(
  "/",
  asyncWrapper(checkAuthenticity),
  asyncWrapper(getAllContacts)
);

contactsRouter.get(
  "/:contactId",
  checkIsValidId(),
  asyncWrapper(checkAuthenticity),
  asyncWrapper(getOneContact)
);

contactsRouter.delete(
  "/:contactId",
  checkIsValidId(),
  asyncWrapper(checkAuthenticity),
  asyncWrapper(deleteContact)
);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  asyncWrapper(checkAuthenticity),
  asyncWrapper(createContact)
);

contactsRouter.put(
  "/:contactId",
  checkIsValidId(),
  validateBody(updateContactSchema),
  asyncWrapper(checkAuthenticity),
  asyncWrapper(updateContact)
);

contactsRouter.patch(
  "/:contactId/favorite",
  checkIsValidId(),
  validateBody(updateFavStatusSchema),
  asyncWrapper(checkAuthenticity),
  asyncWrapper(updateStatusContact)
);

export default contactsRouter;
