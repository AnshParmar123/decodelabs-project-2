const store = require('../data/store');
const ApiError = require('../utils/ApiError');

function list(req, res) {
  const { status } = req.query;
  const contacts = store.getAll({ status });
  res.status(200).json({ count: contacts.length, data: contacts });
}

function getOne(req, res, next) {
  const id = Number(req.params.id);
  const contact = store.getById(id);

  if (!contact) {
    return next(ApiError.notFound(`No contact message with id ${req.params.id}`));
  }
  res.status(200).json({ data: contact });
}

function create(req, res) {
  const contact = store.create(req.body);
  res.status(201).location(`/api/contacts/${contact.id}`).json({ data: contact });
}

function updateStatus(req, res, next) {
  const id = Number(req.params.id);
  const { status } = req.body;

  const updated = store.update(id, status ? { status } : {});
  if (!updated) {
    return next(ApiError.notFound(`No contact message with id ${req.params.id}`));
  }
  res.status(200).json({ data: updated });
}

function remove(req, res, next) {
  const id = Number(req.params.id);
  const deleted = store.remove(id);

  if (!deleted) {
    return next(ApiError.notFound(`No contact message with id ${req.params.id}`));
  }
  res.status(204).send();
}

module.exports = { list, getOne, create, updateStatus, remove };
