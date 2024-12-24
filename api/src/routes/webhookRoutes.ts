// Installed Utils
import express from 'express';
import { body } from 'express-validator';

// App Utils
import i18n from '../i18n.config';
import { webhook } from '../controllers/webhookController';

// Rules to validate a webhook request
const validateWebhook = [
  body('object')
    .equals('page')
    .withMessage(i18n.__('invalid_object_type')),
  body('entry')
    .isArray()
    .withMessage(i18n.__('entry_must_be_an_array')),
  body('entry.*.messaging')
    .isArray()
    .withMessage(i18n.__('messaging_must_be_an_array')),
  body('entry.*.messaging.*.sender.id')
    .exists()
    .withMessage(i18n.__('sender_id_is_required'))
    .isString()
    .escape()
    .withMessage(i18n.__('sender_id_must_be_string')),
  body('entry.*.messaging.*.recipient.id')
    .exists()
    .withMessage(i18n.__('sender_id_must_be_string'))
    .isString()
    .escape()
    .withMessage(i18n.__('recipient_id_is_required')),
  body('entry.*.messaging.*.message.mid')
    .exists()
    .withMessage(i18n.__('message_id_is_required'))
    .isString()
    .escape()
    .withMessage(i18n.__('message_id_must_be_a_string')),
  body('entry.*.messaging.*.message.text')
    .optional()
    .isString()
    .escape()
    .withMessage(i18n.__('message_text_must_be_a_string'))
];

// Init the route manager
const webhookRoute = express.Router();

// Supported routes
webhookRoute.post('/', validateWebhook, webhook);

export default webhookRoute;
