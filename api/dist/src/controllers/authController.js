'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.changePassword =
  exports.reset =
  exports.login =
  exports.register =
    void 0;
const express_validator_1 = require('express-validator');
const mongoose_1 = __importDefault(require('mongoose'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const nodemailer_1 = __importDefault(require('nodemailer'));
// App Utils
const userModel_1 = __importDefault(require('../models/userModel'));
const i18n_config_1 = __importDefault(require('../i18n.config'));
/**
 * Register User Accounts
 *
 * @param Request req
 * @param Response res
 */
const register = async (req, res) => {
  const errors = (0, express_validator_1.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  // Get the user data
  const { email, password } = req.body;
  try {
    // Create user
    const saveUser = await userModel_1.default.create({ email, password });
    // Return success message
    res.status(201).json({
      success: true,
      message: i18n_config_1.default.__('user_was_created_successfully'),
      user: saveUser,
    });
  } catch (error) {
    // Status code for response
    let statusCode = 200;
    // Default error message
    let errorMessage = i18n_config_1.default.__(
      'an_error_occurred_while_creating_user',
    );
    // Check if error is an instace of Error
    if (error instanceof Error) {
      if ('code' in error && error.code === 11000) {
        errorMessage = i18n_config_1.default.__('email_already_registered');
      } else if (
        error.name === 'ValidationError' &&
        error instanceof mongoose_1.default.Error.ValidationError
      ) {
        errorMessage = Object.values(error.errors)
          .map((val) => val.message)
          .join(', ');
      }
    }
    // Return failed response
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
exports.register = register;
/**
 * Sign In Users
 *
 * @param Request req
 * @param Response res
 */
const login = async (req, res) => {
  const errors = (0, express_validator_1.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  // Get the user data
  const { email, password } = req.body;
  try {
    // Get a user
    const oneUser = await userModel_1.default.findOne({ email });
    // Verify if the user was found
    if (!oneUser) {
      // Return error message
      return res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('user_was_not_found'),
      });
    }
    // Compare if the passwords are equal
    const compare = await bcryptjs_1.default.compare(
      password,
      oneUser.password,
    );
    // Verify if the compare is true
    if (compare) {
      // Generate an access token
      const token = jsonwebtoken_1.default.sign(
        { id: oneUser._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30d' },
      );
      // Return success message
      res.status(200).json({
        success: true,
        message: i18n_config_1.default.__('you_have_successfully_signed_in'),
        content: {
          id: oneUser._id,
          email: oneUser.email,
          token: token,
        },
      });
    } else {
      // Return error message
      res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('email_password_incorrect'),
      });
    }
  } catch (error) {
    // Status code for response
    let statusCode = 200;
    // Default error message
    let errorMessage = i18n_config_1.default.__(
      'an_error_occurred_while_creating_user',
    );
    // Check if error is an instace of Error
    if (error instanceof Error) {
      if (
        error.name === 'ValidationError' &&
        error instanceof mongoose_1.default.Error.ValidationError
      ) {
        errorMessage = Object.values(error.errors)
          .map((val) => val.message)
          .join(', ');
      }
    }
    // Return failed response
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
exports.login = login;
/**
 * Request a reset password link
 *
 * @param Request req
 * @param Response res
 */
const reset = async (req, res) => {
  const errors = (0, express_validator_1.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  // Get the user data
  const { email } = req.body;
  try {
    // Get a user
    const oneUser = await userModel_1.default.findOne({ email });
    // Verify if the user was found
    if (!oneUser) {
      // Return error message
      return res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('user_was_not_found'),
      });
    }
    // Generate a reset code
    const reset_code = jsonwebtoken_1.default.sign(
      { id: oneUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: Math.floor(Date.now() / 1000) + 600 },
    );
    // Create the reset password link
    const reset_link =
      process.env.WEBSITE_URL + '/auth/change-password/' + reset_code;
    // HTML email body
    const email_body = `<br />
        You're receiving this email because you requested a password reset for your account.
        <br />
        <br />
        Please go to the following page and create a new password:<br />
        <br />
        <a href="${reset_link}" rel="noreferrer" target="_blank">
            ${reset_link}
        </a>
        <br />`;
    // Create a transporter object with smtp configuration
    const transporter = nodemailer_1.default.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    // Setup email data with unicode symbols
    const emailOptions = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: i18n_config_1.default.__('password_reset'),
      html: email_body,
    };
    // Send mail with defined transport object
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        // Return error message
        return res.status(200).json({
          success: false,
          message: error,
        });
      }
      // Return success message
      return res.status(200).json({
        success: true,
        message: i18n_config_1.default.__('password_reset_email_sent'),
      });
    });
  } catch (error) {
    // Status code for response
    let statusCode = 200;
    // Default error message
    let errorMessage = i18n_config_1.default.__(
      'an_error_occurred_while_creating_reset_link',
    );
    // Check if error is an instace of Error
    if (error instanceof Error) {
      if (
        error.name === 'ValidationError' &&
        error instanceof mongoose_1.default.Error.ValidationError
      ) {
        errorMessage = Object.values(error.errors)
          .map((val) => val.message)
          .join(', ');
      }
    }
    // Return failed response
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
    });
  }
};
exports.reset = reset;
/**
 * Change the password
 *
 * @param Request req
 * @param Response res
 */
const changePassword = async (req, res) => {
  const errors = (0, express_validator_1.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  // Get the password and code
  const { code, password, repeatPassword } = req.body;
  // Verify if password match
  if (password != repeatPassword) {
    // Return error message
    return res.status(200).json({
      success: false,
      message: i18n_config_1.default.__('passwords_must_match'),
    });
  }
  try {
    // Decode the authorization's code
    const decodeToken = jsonwebtoken_1.default.verify(
      code,
      process.env.JWT_SECRET_KEY,
    );
    // Extract the user's ID
    const { id } = decodeToken;
    // Find and update the password
    await userModel_1.default.findOneAndUpdate(
      { _id: id.toString() },
      { $set: { password: password } },
      { new: true },
    );
    // Return success message
    res.status(200).json({
      success: true,
      message: i18n_config_1.default.__('password_was_changed_successfully'),
    });
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
        message: i18n_config_1.default.__('password_reset_code_not_valid'),
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
exports.changePassword = changePassword;
