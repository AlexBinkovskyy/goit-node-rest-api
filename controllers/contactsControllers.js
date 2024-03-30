import {
    getContactById,
    getContacts,
    removeContact,
    addContact,
    updateContactById,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (_, res, next) => {
    try {
        const result = await getContacts();
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getContactById(id);
        if (!result) {
            next(HttpError(404))
            return;
        }
        res.json(result);
    } catch (error) {
        next(error)
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contactToRemove = await removeContact(id)
        res.json(contactToRemove)
    } catch (error) {
        next(error)
    }
};

export const createContact = async (req, res, next) => {
    const {name, email, phone} = req.body
    try {
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact)
    } catch (error) {
        next(error)
    }
};

export const updateContact = (req, res, next) => {
    const {id} = req.params
    const {name, email, phone} = req.body
    
};
