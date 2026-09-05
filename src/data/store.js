/**
 * In-memory data store for contact messages.
 * Deliberately not a database — Project 2's brief scopes this as a
 * "simple backend API" before scaling into persistence.
 */

let contacts = [];
let nextId = 1;

function seed() {
  contacts = [
    {
      id: nextId++,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      message: 'Loved your portfolio — is your CascadeSignal research paper public anywhere?',
      status: 'read',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
      id: nextId++,
      name: 'Daniel Reyes',
      email: 'daniel.reyes@example.com',
      message: 'We are hiring frontend interns at our agency, would love to chat.',
      status: 'new',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];
}

seed();

function getAll({ status } = {}) {
  if (!status) return contacts;
  return contacts.filter((c) => c.status === status);
}

function getById(id) {
  return contacts.find((c) => c.id === id);
}

function create({ name, email, message }) {
  const contact = {
    id: nextId++,
    name,
    email,
    message,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  contacts.push(contact);
  return contact;
}

function update(id, changes) {
  const contact = getById(id);
  if (!contact) return null;
  Object.assign(contact, changes);
  return contact;
}

function remove(id) {
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) return false;
  contacts.splice(index, 1);
  return true;
}

module.exports = { getAll, getById, create, update, remove };
