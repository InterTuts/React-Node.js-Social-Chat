// System Utils
import { Request, Response } from 'express';

// Installed Utils
import sinon from 'sinon';
import { ValidationError } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer, { Transporter } from 'nodemailer';

// App Utils
import axios from '../../src/axios';
import user from '../../src/models/userModel.js';
import {
  login,
  register,
  reset,
  changePassword,
} from '../../src/controllers/authController.js';

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
describe('Email Regstration', () => {
  let userCreateStub: any;

  beforeEach(() => {
    // Stub user.create method
    userCreateStub = sinon.stub(user, 'create');
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
    await register(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 201);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
      success: true,
      message: 'The user was created successfully.',
      user: mockUser,
    });
  });

  it('should fail user creation', async () => {
    // Set up a spy on axios post requests
    const axiosRequestSpy = sinon.spy(axios, 'post');

    // Make an AJAX request with POST parameters
    const response = await axios.post('api/auth/register', {
      email: 'value1',
      password: 'value2',
    });

    // Assert that the spy was called
    sinon.assert.called(axiosRequestSpy);

    // Assert that the request was made to the expected url
    sinon.assert.match(axiosRequestSpy.firstCall.args[0], 'api/auth/register');

    // Assert that the request contains the expected email
    sinon.assert.match(axiosRequestSpy.firstCall.args[1].email, 'value1');

    // Assert that the request contains the expected password
    sinon.assert.match(axiosRequestSpy.firstCall.args[1].password, 'value2');

    // Assert the response status
    sinon.assert.match(response.status, 200);

    // Compare if the validations are working
    sinon.assert.match(response.data, {
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
  let userFindOneStub: any, compareStub: any, signStub: any;

  beforeEach(() => {
    // Stub user.findOne method
    userFindOneStub = sinon.stub(user, 'findOne');
    // Stub bcrypt.compare method
    compareStub = sinon.stub(bcrypt, 'compare');
    // Stub jwt.signin method
    signStub = sinon.stub(jwt, 'sign');
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
    await login(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
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
    await login(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
      success: false,
      message: 'The email or password is not correct.',
    });
  });

  it('should test login validation', async () => {
    // Make an AJAX request with POST parameters
    const response = await axios.post('api/auth/sign-in', {
      email: 'value1',
      password: 'value2',
    });

    // Assert the response status
    sinon.assert.match(response.status, 200);

    // Compare if the validations are working
    sinon.assert.match(response.data, {
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
  let userFindOneStub: any, signStub: any, createTransportStub: any;

  beforeEach(() => {
    // Stub user.create method
    userFindOneStub = sinon.stub(user, 'findOne');

    // Stub jwt.signin method
    signStub = sinon.stub(jwt, 'sign');

    // Create a stub for sendMail function
    const sendMailStub = sinon.stub().yields(null, { response: 'success' });

    // Create a partial mock for Transporter
    const transporterMock: Partial<Transporter> = {
      sendMail: sendMailStub as any,
    };

    // Stub nodemailer.createTransport to return the mock transporter
    createTransportStub = sinon
      .stub(nodemailer, 'createTransport')
      .returns(transporterMock as Transporter);
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
    await reset(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
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
    await reset(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
      success: false,
      message: 'The user was not found.',
    });
  });
});

describe('Password Change', () => {
  let jwtStub: any, findOneAndUpdateStub: any;

  beforeEach(() => {
    // Stub jwt.verify method
    jwtStub = sinon.stub(jwt, 'verify');
    // Stub user.findOneAndUpdate method
    findOneAndUpdateStub = sinon.stub(user, 'findOneAndUpdate');
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
    await changePassword(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
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
    await changePassword(req, res);

    // Check for expected status
    sinon.assert.calledOnceWithExactly(res.status as sinon.SinonStub, 200);

    // Verify for expected response
    sinon.assert.calledOnceWithExactly(res.json as sinon.SinonStub, {
      success: false,
      message: 'Passwords must match.',
    });
  });
});
