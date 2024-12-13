'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const userModel_1 = __importDefault(require('../models/userModel'));
const i18n_config_1 = __importDefault(require('../i18n.config'));
const userMiddleware = async (req, res, next) => {
  try {
    // Verify in the header for authorization
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get the full authorization value
      const authToken = req.headers.authorization;
      // Get the authorization's code
      const token = authToken.split(' ')[1];
      // Decode the authorization's code
      const decodeToken = jsonwebtoken_1.default.verify(
        token,
        process.env.JWT_SECRET_KEY,
      );
      // Extract the user's ID
      const { id } = decodeToken;
      // Get the user data
      const userData = await userModel_1.default.findById(id);
      // Verify if user data exists
      if (userData) {
        // Add the user property to the req object
        req.user = {
          _id: userData._id.toString(),
          email: userData.email,
        };
      }
      next();
    } else {
      // Return error
      res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('authorization_token_not_valid'),
      });
    }
  } catch (error) {
    // Verify if the session is expired
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      typeof error.name === 'string' &&
      error.name === 'TokenExpiredError'
    ) {
      // Return error to user
      res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('your_session_has_expired'),
      });
    } else {
      // Return error to user
      res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('an_unknown_error_occurred'),
      });
    }
  }
};
exports.userMiddleware = userMiddleware;