'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const axios_1 = __importDefault(require('axios'));
const sinon_1 = __importDefault(require('sinon'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
// App Utils
const socialController_1 = require('../../src/controllers/socialController');
const userModel_js_1 = __importDefault(
  require('../../src/models/userModel.js'),
);
// A mock for requests
const mockRequest = (body = {}, errors = []) => {
  return {
    body,
    get: () => null,
    app: { get: () => null },
  };
};
// A mock for responses
const mockResponse = () => {
  const res = {};
  res.status = sinon_1.default.stub().returns(res);
  res.json = sinon_1.default.stub().returns(res);
  return res;
};
// Test suite
describe('Change the Authorization Code for an Access Token', () => {
  let requestTokenStub, accountDataStub, oneUserStub, tokenStub;
  beforeEach(() => {
    requestTokenStub = sinon_1.default.stub(axios_1.default, 'post');
    accountDataStub = sinon_1.default.stub(axios_1.default, 'get');
    oneUserStub = sinon_1.default.stub(userModel_js_1.default, 'find');
    tokenStub = sinon_1.default.stub(jsonwebtoken_1.default, 'sign');
  });
  afterEach(() => {
    requestTokenStub.restore();
    accountDataStub.restore();
    oneUserStub.restore();
    tokenStub.restore();
  });
  it('should change the authorization code with an access token for registered user', async () => {
    // Test User Email
    const email = 'test@example.com';
    // Test JWT Token
    const token = 'token1234';
    // Create an example of authorization code
    const requestData = { code: '112' };
    // Set authorization code to the mock for Express Request
    const req = mockRequest(requestData);
    // Get the response
    const res = mockResponse();
    // Substitute the Google API request for access token and set the response
    requestTokenStub.resolves({ status: 200, data: { access_token: 'none' } });
    // Substitute the Google API request for user data and set the response
    accountDataStub.resolves({ data: { id: '123', email: email } });
    // Substitute the Mongoose User model and set the response
    oneUserStub.resolves([{ _id: '123', email: email }]);
    // Substitute the JSON Web Token signin request and set the response
    tokenStub.returns(token);
    // Call the getSocialCode function for testing
    await (0, socialController_1.getSocialCode)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: true,
      message: 'You have successfully signed in.',
      content: { id: '123', email: email, token: token },
    });
  });
  it('should change the authorization code with an access token  for non registered user', async () => {
    // Test User Email
    const email = 'test@example.com';
    // Test JWT Token
    const token = 'token1234';
    // Create an example of authorization code
    const requestData = { code: '112' };
    // Set authorization code to the mock for Express Request
    const req = mockRequest(requestData);
    // Get the response
    const res = mockResponse();
    // Substitute the Google API request for access token and set the response
    requestTokenStub.resolves({ status: 200, data: { access_token: 'none' } });
    // Substitute the Google API request for user data and set the response
    accountDataStub.resolves({ data: { id: '123', email: email } });
    // Substitute the Mongoose User model and set the response
    oneUserStub.resolves(null);
    // Substitute the JSON Web Token signin request and set the response
    tokenStub.returns(token);
    // Call the getSocialCode function for testing
    await (0, socialController_1.getSocialCode)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: true,
      content: { social_id: '123', email: email },
    });
  });
});
