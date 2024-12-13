// System Utils
import { Request, Response } from 'express';

// Installed Utils
import axios from 'axios';
import sinon from 'sinon';
import { ValidationError } from 'express-validator';
import jwt from 'jsonwebtoken';

// App Utils
import { getSocialCode } from '../../src/controllers/socialController';
import user from '../../src/models/userModel.js';

// A mock for requests
const mockRequest = (body = {}, errors: ValidationError[] = []): Request => {
  return {
    body,
    get: () => null,
    app: { get: () => null },
  } as unknown as Request;
};

// A mock for responses
const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

// Test suite
describe('Change the Authorization Code for an Access Token', () => {
  let requestTokenStub: any,
    accountDataStub: any,
    oneUserStub: any,
    tokenStub: any;

  beforeEach(() => {
    requestTokenStub = sinon.stub(axios, 'post');
    accountDataStub = sinon.stub(axios, 'get');
    oneUserStub = sinon.stub(user, 'find');
    tokenStub = sinon.stub(jwt, 'sign');
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
    await getSocialCode(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
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
    await getSocialCode(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
      success: true,
      content: { social_id: '123', email: email },
    });
  });
});
