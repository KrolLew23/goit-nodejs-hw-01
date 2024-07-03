import fs from 'fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contactsPath = path.join(__dirname, './db/contacts.json');
const rl = readline.createInterface({ input, output });

const getParsedContactsList = async () => {
  let parsedContacts = [];
  await fs
    .readFile(contactsPath, 'utf8')
    .then(contacts => {
      parsedContacts = JSON.parse(contacts);
    })
    .catch(err => console.log(err.message));
  return parsedContacts;
};

const listContacts = async () => {
  rl.close();
  const contacts = await getParsedContactsList();
  console.log(`Contacts list read from contacts.json file.`);
  console.table(contacts);
};

const getContactById = async contactId => {
  rl.close();
  const contacts = await getParsedContactsList();
  const contact = contacts.find(c => c.id === contactId);
  console.log(`Information about Contact with ID: ${contactId}, saved in contacts.json file:`);
  console.table([contact]);
};

const addContact = async (name, email, phone) => {
  rl.close();
  const contacts = await getParsedContactsList();
  const newId = nanoid();
  const newContact = {
    id: `${newId}`,
    name,
    email,
    phone,
  };
  console.log(`Adding Contact ${newContact.name} to Contacts list...`);
  const newContactsList = [...contacts, newContact];
  console.log(`Contacts list after adding a new Contact:`);
  console.table(newContactsList);
  await fs.writeFile(contactsPath, JSON.stringify(newContactsList));
  console.log(`Contacts list also updated in contacts.json file.`);
};

const removeContact = async contactId => {
  const contacts = await getParsedContactsList();
  const answer = await rl.question(
    `Do You really want to remove Contact with ID: ${contactId}? (y/n)\n > `
  );
  if (answer === 'y' || answer === 'Y') {
    rl.close();
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    const deletedContacts = contacts.filter(c => c.id === contactId);
    console.log(`Deleted Contact details:`);
    console.table(deletedContacts);
    console.log(`Contacts list after removing contact with ID: ${contactId}`);
    fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
    console.table(filteredContacts);
    console.log(`Contacts list also updated in contacts.json file.`);
  } else {
    rl.close();
    console.log(`CANCELLED removing Contact with ID: ${contactId}!`);
    return;
  }
};

export { listContacts, getContactById, addContact, removeContact };