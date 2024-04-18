import HttpError from "../helpers/HttpError.js";
import { findContactById } from "../helpers/findContactById.js";
import { checkEmptyUpdtObj } from "../midleWare/checkEmptyUpdtObj.js";
import { checkResponse } from "../midleWare/checkResponse.js";
import { Contact } from "../models/contact.js";

export const getAllContacts = async (req, res) => {
  const { page = 1, limit = 10, favorite: favor } = req.query;
  const count = await Contact.countDocuments({ owner: req.user.id });
  let filter = favor !== undefined
    ? { owner: req.user.id, favorite: favor }
    : { owner: req.user.id };
  const result = await Contact.find(
    filter,
    {
      createdAt: 0,
      updatedAt: 0,
    },
    { skip: limit * (page - 1), limit: limit }
  ).populate("owner", { password: 0, token: 0 });
  !result || !result.length
    ? res.json({ message: "Data base is empty or bad query" })
    : res.json({ page: page, perPage: limit, totallRecords: count, result });
};

export const getOneContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const result = await findContactById(contactId);
  checkResponse(result, next);
  if (result.owner._id.toString() !== userId)
    throw HttpError(401, "Not authorised");
  res.json(result);
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  let contactToRemove = await findContactById(contactId);
  if (contactToRemove.owner._id.toString() !== userId)
    throw HttpError(401, "Not authorised");
  contactToRemove = await Contact.findByIdAndDelete(contactId, {
    createdAt: 0,
    updatedAt: 0,
  });
  checkResponse(contactToRemove);
  res.json(req.params);
};

export const createContact = async (req, res, next) => {
  req.body.owner = req.user._id;
  const newContact = await Contact.create(req.body);
  checkResponse(newContact);
  res.status(201).json(newContact);
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const { id: userId } = req.user;
  const { ...restParams } = req.body;

  let updatedContact = await findContactById(contactId);
  checkEmptyUpdtObj(restParams, next);
  if (updatedContact.owner._id.toString() !== userId)
    throw HttpError(401, "Not authorised");
  updatedContact = await Contact.findByIdAndUpdate(
    contactId,
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
  const { id: userId } = req.user;
  let updatedContact = await findContactById(contactId);
  if (updatedContact.owner._id.toString() !== userId)
    throw HttpError(401, "Not authorised");
  updatedContact = await Contact.findByIdAndUpdate(
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
