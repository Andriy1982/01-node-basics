const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'db/contacts.json');

async function getContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
  } catch (err) {
    console.log(err);
  }
}

async function listContacts() {
  try {
    console.table(await getContacts());
  } catch (err) {
    console.log(err);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await getContacts();
    console.log(contacts.find(({ id }) => id === contactId));
  } catch (err) {
    console.log(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await getContacts();
    const isContactById = contacts.some(({ id }) => id === contactId);
    if (!isContactById) {
      throw new Error('There is no contact with such id');
    }
    fs.writeFile(
      contactsPath,
      JSON.stringify(contacts.filter(({ id }) => id !== contactId)),
    );
    console.log(`Done. We delete contact with id ${contactId}`);
  } catch (err) {
    console.log(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await getContacts();

    const newContacts = [
      ...contacts,
      {
        id: uuidv4(),
        name,
        email,
        phone,
      },
    ];
    await fs.writeFile(contactsPath, JSON.stringify(newContacts));
    console.log("We add new contact");
  } catch (err) {
    console.log(err);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
