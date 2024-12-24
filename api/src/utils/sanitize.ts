// Installed Utils
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import { param } from 'express-validator';

// App Utils
import i18n from '../i18n.config';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize a string
 * 
 * @param input 
 * 
 * @returns sanitized string
 */
export const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input);
};

// Sanitize the received slug
export const sanitizeSlug = [
    param('slug')
    .trim()
    .escape()
    .isLength({ min: 1, max: 200 })
    .withMessage(i18n.__('invalid_slug_provided'))
];

// Sanitize the received network
export const sanitizeNetwork = [
    param('network')
    .trim()
    .escape()
    .isLength({ min: 1, max: 30 })
    .withMessage(i18n.__('invalid_slug_provided'))
];

// Sanitize the received thread id
export const sanitizeThreadId = [
    param('threadId')
    .trim()
    .escape()
    .isLength({ min: 1, max: 500 })
    .withMessage(i18n.__('invalid_thread_id_provided'))
];