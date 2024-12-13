'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const express_1 = __importDefault(require('express'));
const express_validator_1 = require('express-validator');
// App Utils
const i18n_config_1 = __importDefault(require('../i18n.config'));
const authController_1 = require('../controllers/authController');
const socialController_1 = require('../controllers/socialController');
// Init the route manager
const authRoute = express_1.default.Router();
// Supported routes
authRoute.post(
  '/register',
  [
    (0, express_validator_1.body)('email')
      .notEmpty()
      .trim()
      .isEmail()
      .withMessage(i18n_config_1.default.__('invalid_email_address')),
    (0, express_validator_1.body)('password')
      .notEmpty()
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(i18n_config_1.default.__('password_incorrect_length')),
  ],
  authController_1.register,
);
authRoute.post(
  '/sign-in',
  [
    (0, express_validator_1.body)('email')
      .trim()
      .isEmail()
      .withMessage(i18n_config_1.default.__('invalid_email_address')),
    (0, express_validator_1.body)('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(i18n_config_1.default.__('password_incorrect_length')),
  ],
  authController_1.login,
);
authRoute.post(
  '/reset',
  [
    (0, express_validator_1.body)('email')
      .trim()
      .isEmail()
      .withMessage(i18n_config_1.default.__('invalid_email_address')),
  ],
  authController_1.reset,
);
authRoute.post(
  '/change-password',
  [
    (0, express_validator_1.body)('code')
      .trim()
      .notEmpty()
      .withMessage(i18n_config_1.default.__('password_reset_code_required')),
    (0, express_validator_1.body)('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(i18n_config_1.default.__('password_incorrect_length')),
    (0, express_validator_1.body)('repeatPassword')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(i18n_config_1.default.__('password_incorrect_length')),
  ],
  authController_1.changePassword,
);
authRoute.get('/social-connect', socialController_1.socialConnect);
authRoute.post(
  '/get-social-info',
  [
    (0, express_validator_1.body)('code')
      .trim()
      .notEmpty()
      .withMessage(i18n_config_1.default.__('authorization_code_not_provided')),
  ],
  socialController_1.getSocialCode,
);
authRoute.post(
  '/social-register',
  [
    (0, express_validator_1.body)('social_id')
      .trim()
      .notEmpty()
      .withMessage(i18n_config_1.default.__('social_id_required')),
    (0, express_validator_1.body)('email')
      .trim()
      .isEmail()
      .withMessage(i18n_config_1.default.__('invalid_email_address')),
    (0, express_validator_1.body)('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage(i18n_config_1.default.__('password_incorrect_length')),
  ],
  socialController_1.registerWithSocial,
);
exports.default = authRoute;
