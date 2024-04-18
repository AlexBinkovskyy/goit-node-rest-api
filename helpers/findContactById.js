import { Contact } from "../models/contact.js";

export const findContactById = async (id) => {
  return await Contact.findById(id, {
    createdAt: 0,
    updatedAt: 0,
  }).populate('owner', {password: 0, token: 0});
};
