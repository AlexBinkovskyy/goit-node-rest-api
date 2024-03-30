import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";


const contactsPath = path.join("db", "contacts.json");

const getList = async () => {
    const response = await fs.readFile(contactsPath);
    return JSON.parse(response);
};

const getContact = async (contactId) => {
    const contact = (await getList()).find((contact) => contact.id === contactId);
    return contact;
};

export async function getContacts() {
    try {
        return await getList();
    } catch (error) {
        console.log(error.message);
    }
}

export async function getContactById(contactId) {
    try {
        const responseId = await getContact(contactId);
        return responseId || null;
    } catch (error) {
        console.log(error.message);
    }
}

export async function removeContact(contactId) {
    try {
        const contactToRemove = await getContact(contactId);
        if (!contactToRemove) {
            return
        }
        const newContactList = (await getList()).filter((contact) => contact.id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(newContactList, null, 2));
        return contactToRemove ? contactToRemove : null;
    } catch (error) {
        console.error(error.message);
    }
}

export async function addContact(name, email, phone) {
    const ID = crypto.randomUUID();
    try {
        const newContact = {
            id: ID,
            name: name,
            email: email,
            phone: phone,
        };
        let response = await getList();
        response.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(response));
        return newContact;
    } catch (error) {
        console.log(error.message);
    }
}

export async function updateContactById(contactId, data) {
    try {
        const contacts = await getList();
        const index = contacts.findIndex((contact) => contact.id === contactId);
        if (index === -1) {
            return null;
        }
        contacts[index] = { contactId, ...data };
        await fs.writeFile(contactsPath, JSON.stringify(contactsPath, null, 2));
    } catch (error) {
        console.log(error.message);
    }
}
