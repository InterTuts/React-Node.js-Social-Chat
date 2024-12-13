// System Utils
import React from 'react';

// Installed Utils
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axiosMockAdapter from 'axios-mock-adapter';

// App Utils
import renderWithProviders from '../../../../test/renderWithProviders';
import AuthSignIn from '../AuthSignIn';
import axios, { type AxiosResponse } from '@/axios';
import { login } from '@/lib/redux/features/auth/authSlice';
import { makeStore } from '@/lib/redux/store';

const mock = new axiosMockAdapter(axios);

describe('AuthSignIn Component', () => {

  test('renders the form fields', async () => {

    // Render the Form Component with providers
    await renderWithProviders(<AuthSignIn />);

    // Select the input by placeholder text
    const emailInput = screen.getByPlaceholderText('Enter your email ...');

    // Assert that the input is in the document
    expect(emailInput).toBeInTheDocument();

    // Optionally, you can also assert its type
    expect(emailInput).toHaveAttribute('type', 'email');

    // Select the input by placeholder text
    const passwordInput = screen.getByPlaceholderText('Enter your password ...');

    // Assert that the input is in the document
    expect(passwordInput).toBeInTheDocument();

    // Optionally, you can also assert its type
    expect(passwordInput).toHaveAttribute('type', 'password');  
    
    // Get the button
    const button = screen.getByText('Login');

    // Assert that the button is in the document
    expect(button).toBeInTheDocument();

  });  

  test('renders the form links', async () => {

    // Render the Form Component with providers
    await renderWithProviders(<AuthSignIn />);

    // Find the Forget Password? link
    const forgetPasswordLink = screen.getByText('Forget Password?');

    // Assert that the Forget Password? link is present in the document
    expect(forgetPasswordLink).toBeInTheDocument();

    // Find the Sign Up link
    const signUpLink = screen.getByText('Sign Up');

    // Assert that Sign Up link is present in the document
    expect(signUpLink).toBeInTheDocument();

  });

  test('success login', async () => {

    // Get the store
    const store = makeStore();

    // User Login
    const mockUser = { email: 'test@example.com', password: 'password' };

    // Login Response
    const mockResponse = {
      success: true,
      message: 'You have successfully signed in.',
      content: {
        id: '111',
        email: 'test@example.com',
        token: 'token'
      }
    };

    // Mock the axios post request
    mock.onPost('api/auth/sign-in').reply(200, mockResponse);

    // Login success
    await store.dispatch(login(mockUser));

    // Access the state
    const state = store.getState();

    // Assert the state
    expect(state.auth.login.isLoading).toBe(false);
    expect(state.auth.login.successMessage).toBe('You have successfully signed in.');
    expect(state.auth.login.errorMessage).toBe('');

  }); 
  
  it('test form input change', async () => {

    // Create a user's object
    const user = userEvent.setup();

    // Render the Form Component with providers
    await renderWithProviders(<AuthSignIn />);    

    // Select the input by placeholder text
    const emailInput = screen.getByPlaceholderText('Enter your email ...');

    // Select the input by placeholder text
    const passwordInput = screen.getByPlaceholderText('Enter your password ...');

    // Get the button
    const button = screen.getByText('Login');

    // Set email input value
    await user.type(emailInput, 'info@example.com');

    // Set password input value
    await user.type(passwordInput, '1234');

    // Assert email value is filled
    expect(emailInput).toHaveValue('info@example.com');

    // Assert password value is filled
    expect(passwordInput).toHaveValue('1234');

    // Submit the form on button click
    await user.click(button);

    // Assert error validation for password exists
    expect(screen.getByText('The password should have minimum 8 characters.')).toBeInTheDocument();

  });

});