import HttpError from "../helpers/HttpError.js";
import { checkEmptyUpdtObj } from "../midleWare/checkEmptyUpdtObj.js";
import { checkResponse } from "../midleWare/checkResponse.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (_, res) => {
  const result = await Contact.find();
  !result || !result.length
    ? res.json({ message: "Data base is empty" })
    : res.json(result);
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  checkResponse(result, next);
  res.json(result);
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;
  const contactToRemove = await Contact.findByIdAndDelete(id);
  checkResponse(contactToRemove);
  res.json(contactToRemove);
};

export const createContact = async (req, res, next) => {
  const newContact = await Contact.create(req.body);
  checkResponse(newContact);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { ...restParams } = req.body;
  checkEmptyUpdtObj(restParams, next);

  const updatedContact = await Contact.findByIdAndUpdate(
    id,
    { ...restParams },
    {
      new: true,
    }
  );
  checkResponse(updatedContact);
  res.status(200).json(updatedContact);
};

export const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;

  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
  if (!updatedContact) {
    next(HttpError(404));
    return;
  }
  res.status(200).json(updatedContact);
};
