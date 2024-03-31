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
            return;
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
        await fs.writeFile(contactsPath, JSON.stringify(response, null, 2));
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
        const { name : dataName, email : dataEmail, phone : dataPhone } = data;
        const updatedContact = { ...contacts[index] };

        dataName ? (updatedContact.name = dataName) : updatedContact.name;
        dataEmail ? (updatedContact.email = dataEmail) : updatedContact.email;
        dataPhone ? (updatedContact.phone = dataPhone) : updatedContact.phone;

        contacts[index] = updatedContact;
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return updatedContact;
    } catch (error) {
        console.log(error.message);
    }
}
