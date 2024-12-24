// Installed Utils
import express from 'express';
import { body, validationResult } from 'express-validator';

// App Utils
import i18n from '../i18n.config';
import { sanitizeNetwork, sanitizeSlug, sanitizeThreadId } from '../utils/sanitize';
import { userMiddleware } from '../middlewares/AuthenticatedRequest';
import { userInfo } from '../controllers/userController';
import { connectAccounts, saveAccounts, networksList, deleteAccount } from '../controllers/socialController';
import { threadsList } from '../controllers/threadsController';
import { newReply, messagesList } from '../controllers/messagesController';

// Init the route manager
const userRoute = express.Router();

// Supported routes
userRoute.get('/info', userMiddleware, userInfo);
userRoute.get('/connect/:slug', sanitizeSlug, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
}, userMiddleware, connectAccounts);
userRoute.post('/token/:network', sanitizeNetwork, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
}, 
[
body('code')
    .trim()
    .notEmpty()
    .escape()
    .withMessage(i18n.__('authorization_code_not_valid'))
], userMiddleware, saveAccounts);
userRoute.get('/networks', userMiddleware, networksList);
userRoute.delete('/networks/:network/:slug', sanitizeNetwork, sanitizeSlug, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
}, userMiddleware, deleteAccount);
userRoute.post('/threads', [
    body('search')
    .trim()
    .isLength({ min: 0, max: 400 })
    .escape()
    .withMessage(i18n.__('search_query_too_long')),
    body('page')
    .notEmpty()
    .trim()
    .isInt()
    .isLength({ min: 0, max: 10 })
    .escape()
    .withMessage(i18n.__('page_number_not_valid'))    
], (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
}, userMiddleware, threadsList);
userRoute.post('/threads/:threadId/message', [
    body('reply')
    .trim()
    .isLength({ min: 1, max: 1024 })
    .escape()
    .withMessage(i18n.__('reply_invalid_length'))    
], sanitizeThreadId, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
}, userMiddleware, newReply);
userRoute.post('/threads/:threadId', [
    body('page')
    .notEmpty()
    .trim()
    .isLength({ min: 0, max: 10 })
    .escape()
    .withMessage(i18n.__('page_number_not_valid'))    
], sanitizeThreadId, (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({
            success: false,
            message: errors.array()[0].msg
        });
    }
    next();
}, userMiddleware, messagesList);

export default userRoute;
