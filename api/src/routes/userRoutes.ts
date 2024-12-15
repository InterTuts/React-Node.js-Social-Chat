// Installed Utils
import express from 'express';
import { body, param, validationResult } from 'express-validator';

// App Utils
import i18n from '../i18n.config';
import { userMiddleware } from '../middlewares/AuthenticatedRequest';
import { userInfo } from '../controllers/userController';
import { connectAccounts, saveAccounts } from '../controllers/socialController';

// Sanitize the received slug
const sanitizeSlug = [
    param('slug')
    .trim()
    .escape()
    .isLength({ min: 1, max: 20 })
    .withMessage(i18n.__('invalid_slug_provided'))
];

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
userRoute.post('/token/:slug', sanitizeSlug, (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    .withMessage(i18n.__('authorization_code_not_valid'))
], userMiddleware, saveAccounts);

export default userRoute;
