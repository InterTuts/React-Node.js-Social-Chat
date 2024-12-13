'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Installed Utils
const sinon_1 = __importDefault(require('sinon'));
const bcryptjs_1 = __importDefault(require('bcryptjs'));
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const nodemailer_1 = __importDefault(require('nodemailer'));
// App Utils
const axios_1 = __importDefault(require('../../src/axios'));
const userModel_js_1 = __importDefault(
  require('../../src/models/userModel.js'),
);
const authController_js_1 = require('../../src/controllers/authController.js');
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
describe('Email Regstration', () => {
  let userCreateStub;
  beforeEach(() => {
    // Stub user.create method
    userCreateStub = sinon_1.default.stub(userModel_js_1.default, 'create');
  });
  afterEach(() => {
    // Restore stubs after each test
    userCreateStub.restore();
  });
  it('should create a user and return success message', async () => {
    // Test User Data
    const mockUser = { email: 'test@example.com', password: 'password123' };
    // Set user's data to mock request
    const req = mockRequest(mockUser);
    // Get the mock for response
    const res = mockResponse();
    // Set test user to the stub
    userCreateStub.resolves(mockUser);
    // Send request
    await (0, authController_js_1.register)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 201);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: true,
      message: 'The user was created successfully.',
      user: mockUser,
    });
  });
  it('should fail user creation', async () => {
    // Set up a spy on axios post requests
    const axiosRequestSpy = sinon_1.default.spy(axios_1.default, 'post');
    // Make an AJAX request with POST parameters
    const response = await axios_1.default.post('api/auth/register', {
      email: 'value1',
      password: 'value2',
    });
    // Assert that the spy was called
    sinon_1.default.assert.called(axiosRequestSpy);
    // Assert that the request was made to the expected url
    sinon_1.default.assert.match(
      axiosRequestSpy.firstCall.args[0],
      'api/auth/register',
    );
    // Assert that the request contains the expected email
    sinon_1.default.assert.match(
      axiosRequestSpy.firstCall.args[1].email,
      'value1',
    );
    // Assert that the request contains the expected password
    sinon_1.default.assert.match(
      axiosRequestSpy.firstCall.args[1].password,
      'value2',
    );
    // Assert the response status
    sinon_1.default.assert.match(response.status, 200);
    // Compare if the validations are working
    sinon_1.default.assert.match(response.data, {
      errors: [
        {
          type: 'field',
          value: 'value1',
          msg: 'Invalid email address.',
          path: 'email',
          location: 'body',
        },
        {
          type: 'field',
          value: 'value2',
          msg: 'Password incorrect length.',
          path: 'password',
          location: 'body',
        },
      ],
    });
  });
});
// Test suite
describe('Email Login', () => {
  let userFindOneStub, compareStub, signStub;
  beforeEach(() => {
    // Stub user.findOne method
    userFindOneStub = sinon_1.default.stub(userModel_js_1.default, 'findOne');
    // Stub bcrypt.compare method
    compareStub = sinon_1.default.stub(bcryptjs_1.default, 'compare');
    // Stub jwt.signin method
    signStub = sinon_1.default.stub(jsonwebtoken_1.default, 'sign');
  });
  afterEach(() => {
    // Restore stubs after each test
    userFindOneStub.restore();
    compareStub.restore();
    signStub.restore();
  });
  it('should login a user and return success message', async () => {
    // Test User Email
    const email = 'test@example.com';
    // Test JWT Token
    const token = 'token1234';
    // Test User Data
    const mockUser = { email: email, password: 'password123' };
    // Set user's data to mock request
    const req = mockRequest(mockUser);
    // Get the mock for response
    const res = mockResponse();
    // Set test user to the stub
    userFindOneStub.resolves({ email });
    // The password comparasion in the stub
    compareStub.resolves(true);
    // The generated jwt token
    signStub.returns(token);
    // Send request
    await (0, authController_js_1.login)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: true,
      message: 'You have successfully signed in.',
      content: { id: undefined, email: email, token: token },
    });
  });
  it('should fail the login', async () => {
    // Test User Email
    const email = 'test@example.com';
    // Test JWT Token
    const token = 'token123';
    // Test User Data
    const mockUser = { email: email, password: 'password123' };
    // Set user's data to mock request
    const req = mockRequest(mockUser);
    // Get the mock for response
    const res = mockResponse();
    // Set test user to the stub
    userFindOneStub.resolves({ email });
    // The password comparasion in the stub
    compareStub.resolves(false);
    // The generated jwt token
    signStub.returns(token);
    // Send request
    await (0, authController_js_1.login)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: false,
      message: 'The email or password is not correct.',
    });
  });
  it('should test login validation', async () => {
    // Make an AJAX request with POST parameters
    const response = await axios_1.default.post('api/auth/sign-in', {
      email: 'value1',
      password: 'value2',
    });
    // Assert the response status
    sinon_1.default.assert.match(response.status, 200);
    // Compare if the validations are working
    sinon_1.default.assert.match(response.data, {
      errors: [
        {
          type: 'field',
          value: 'value1',
          msg: 'Invalid email address.',
          path: 'email',
          location: 'body',
        },
        {
          type: 'field',
          value: 'value2',
          msg: 'Password incorrect length.',
          path: 'password',
          location: 'body',
        },
      ],
    });
  });
});
describe('Password Reset', () => {
  let userFindOneStub, signStub, createTransportStub;
  beforeEach(() => {
    // Stub user.create method
    userFindOneStub = sinon_1.default.stub(userModel_js_1.default, 'findOne');
    // Stub jwt.signin method
    signStub = sinon_1.default.stub(jsonwebtoken_1.default, 'sign');
    // Create a stub for sendMail function
    const sendMailStub = sinon_1.default
      .stub()
      .yields(null, { response: 'success' });
    // Create a partial mock for Transporter
    const transporterMock = {
      sendMail: sendMailStub,
    };
    // Stub nodemailer.createTransport to return the mock transporter
    createTransportStub = sinon_1.default
      .stub(nodemailer_1.default, 'createTransport')
      .returns(transporterMock);
  });
  afterEach(() => {
    // Restore stubs after each test
    userFindOneStub.restore();
    signStub.restore();
    createTransportStub.restore();
  });
  it('should send an email with the reset link if the user is found', async () => {
    // Test User Email
    const email = 'test@example.com';
    // Test JWT Token
    const token = 'token123';
    // Test User Data
    const mockUserEmail = { email: email };
    // Set user's data to mock request
    const req = mockRequest(mockUserEmail);
    // Get the mock for response
    const res = mockResponse();
    // Set test user to the stub
    userFindOneStub.resolves(mockUserEmail);
    // The generated jwt token
    signStub.returns(token);
    // Reset password
    await (0, authController_js_1.reset)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: true,
      message: 'The password reset e-mail has been sent.',
    });
  });
  it('should not find user for password reset request', async () => {
    // Test User Email
    const email = 'test@example.com';
    // Test JWT Token
    const token = 'token123';
    // Test User Data
    const mockUserEmail = { email: email };
    // Set user's data to mock request
    const req = mockRequest(mockUserEmail);
    // Get the mock for response
    const res = mockResponse();
    // Set test user to the stub
    userFindOneStub.resolves(null);
    // The generated jwt token
    signStub.returns(token);
    // Reset password
    await (0, authController_js_1.reset)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: false,
      message: 'The user was not found.',
    });
  });
});
describe('Password Change', () => {
  let jwtStub, findOneAndUpdateStub;
  beforeEach(() => {
    // Stub jwt.verify method
    jwtStub = sinon_1.default.stub(jsonwebtoken_1.default, 'verify');
    // Stub user.findOneAndUpdate method
    findOneAndUpdateStub = sinon_1.default.stub(
      userModel_js_1.default,
      'findOneAndUpdate',
    );
  });
  afterEach(() => {
    // Restore stubs after each test
    jwtStub.restore();
    findOneAndUpdateStub.restore();
  });
  it('changes the user password', async () => {
    // Test User Data
    const mockUserData = {
      code: '123',
      password: '12345678',
      repeatPassword: '12345678',
    };
    // Set user's data to mock request
    const req = mockRequest(mockUserData);
    // Get the mock for response
    const res = mockResponse();
    // Decode the code to get user's id
    jwtStub.returns({ id: '1233' });
    // Mark user's password as updated
    findOneAndUpdateStub.resolves(true);
    // Change password
    await (0, authController_js_1.changePassword)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: true,
      message: 'The password was changed successfully.',
    });
  });
  it('passwords must match', async () => {
    // Test User Data
    const mockUserData = {
      code: '123',
      password: '1234567',
      repeatPassword: '12345678',
    };
    // Set user's data to mock request
    const req = mockRequest(mockUserData);
    // Get the mock for response
    const res = mockResponse();
    // Decode the code to get user's id
    jwtStub.returns({ id: '1233' });
    // Mark user's password as updated
    findOneAndUpdateStub.resolves(true);
    // Change password
    await (0, authController_js_1.changePassword)(req, res);
    // Check for expected status
    sinon_1.default.assert.calledOnceWithExactly(res.status, 200);
    // Verify for expected response
    sinon_1.default.assert.calledOnceWithExactly(res.json, {
      success: false,
      message: 'Passwords must match.',
    });
  });
});
