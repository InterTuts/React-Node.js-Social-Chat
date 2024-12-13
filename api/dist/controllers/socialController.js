'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.registerWithSocial =
  exports.getSocialCode =
  exports.socialConnect =
    void 0;
const express_validator_1 = require('express-validator');
const axios_1 = __importDefault(require('axios'));
const querystring_1 = __importDefault(require('querystring'));
const mongoose_1 = __importDefault(require('mongoose'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
// App Utils
const userModel_1 = __importDefault(require('../models/userModel'));
const i18n_config_1 = __importDefault(require('../i18n.config'));
/**
 * Redirect user to Google
 *
 * @param Request req
 * @param Response res
 */
const socialConnect = async (req, res) => {
  // Login params
  const authParams = {
    client_id: process.env.GOOGLE_CLIENT_ID,
    scope:
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    redirect_uri: `${process.env.WEBSITE_URL}api/auth/social-register`,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  };
  // Build the login URL
  const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${querystring_1.default.stringify(authParams)}`;
  // Return the login URL as JSON response
  res.redirect(loginUrl);
};
exports.socialConnect = socialConnect;
/**
 * Change the authorization code to an access token
 *
 * @param Request req
 * @param Response res
 */
const getSocialCode = async (req, res) => {
  const errors = (0, express_validator_1.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  // Get the authorization code
  const { code } = req.body;
  // Check if code is present
  if (!code) {
    return res.status(200).json({
      success: false,
      message: i18n_config_1.default.__('authorization_code_not_provided'),
    });
  }
  // Create the content for the POST request
  const content = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code: decodeURIComponent(code),
    redirect_uri: `${process.env.WEBSITE_URL}api/auth/social-register`,
    grant_type: 'authorization_code',
    access_type: 'offline',
    prompt: 'consent',
  });
  try {
    // Request the access token
    const tokenResponse = await axios_1.default.post(
      'https://www.googleapis.com/oauth2/v4/token',
      new URLSearchParams(content).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );
    // Parse the JSON content
    const jsonResponse = tokenResponse.data;
    // Check if the request was successful
    if (tokenResponse.status !== 200) {
      return res.status(200).json({
        success: false,
        message:
          jsonResponse.error_description ||
          i18n_config_1.default.__('an_unknown_error_occurred'),
      });
    }
    // Extract the access token
    const accessToken = jsonResponse.access_token;
    // Verify if access token is missing
    if (!accessToken) {
      return res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('access_token_not_found'),
      });
    }
    // Initialize a new HttpClient session
    const accountDataResponse = await axios_1.default.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    );
    // Parse the JSON content
    const userInfo = accountDataResponse.data;
    // Extract the user's ID
    const socialId = userInfo.id;
    // Verify if user ID is missing
    if (!socialId) {
      return res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('user_id_not_found'),
      });
    }
    // Get a user
    const oneUser = await userModel_1.default.find({
      social_id: socialId,
    });
    // Verify if user is already registered
    if (Array.isArray(oneUser) && oneUser.length > 0) {
      // Generate an access token
      const token = jsonwebtoken_1.default.sign(
        { id: oneUser[0]._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30d' },
      );
      // Return success message
      return res.status(200).json({
        success: true,
        message: i18n_config_1.default.__('you_have_successfully_signed_in'),
        content: {
          id: oneUser[0]._id,
          email: oneUser[0].email,
          token: token,
        },
      });
    }
    // Return success message
    return res.status(200).json({
      success: true,
      content: {
        social_id: socialId,
        email: userInfo.email,
      },
    });
  } catch (error) {
    if (axios_1.default.isAxiosError(error)) {
      return res.status(200).json({
        success: false,
        message: error.response?.data?.error_description,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: i18n_config_1.default.__('an_internal_error_occurred'),
      });
    }
  }
};
exports.getSocialCode = getSocialCode;
/**
 * Register User Accounts
 *
 * @param Request req
 * @param Response res
 */
const registerWithSocial = async (req, res) => {
  const errors = (0, express_validator_1.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(200).json({ errors: errors.array() });
  }
  // Get the user data
  const { social_id, email, password } = req.body;
  try {
    // Create user
    const saveUser = await userModel_1.default.create({
      email,
      password,
      social_id,
    });
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
exports.registerWithSocial = registerWithSocial;
