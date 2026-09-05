const express = require('express');
const controller = require('../controllers/contacts.controller');
const { validateContactBody, validateStatusUpdate } = require('../middleware/validateContact');

const router = express.Router();

// Resources are nouns, methods are verbs: /contacts, never /getContacts.
router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', validateContactBody, controller.create);
router.put('/:id', validateStatusUpdate, controller.updateStatus);
router.delete('/:id', controller.remove);

module.exports = router;
