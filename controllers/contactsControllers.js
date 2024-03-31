import {
    getContactById,
    getContacts,
    removeContact,
    addContact,
    updateContactById,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (_, res, next) => {
    const result = await getContacts();
    res.json(result);
};

export const getOneContact = async (req, res, next) => {
    const { id } = req.params;
    const result = await getContactById(id);
    if (!result) {
        next(HttpError(404));
        return;
    }
    res.json(result);
};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const contactToRemove = await removeContact(id);
    res.json(contactToRemove);
};

export const createContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
};

export const updateContact = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
        next(HttpError(400, "Body must have at least one field"));
        return;
    }
    const data = { name, email, phone };

    const updatedContact = await updateContactById(id, data);
    if (!updatedContact) {
        next(HttpError(404));
        return;
    }
    res.status(202).json(updatedContact);
};
