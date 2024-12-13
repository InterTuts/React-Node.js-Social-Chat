// Installed Utils
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// App Utils
import Page from '../page';

// Mock Reset Password page
jest.mock('../../../forms/AuthResetPassword', () => () => null);

describe('Reset Password Page', () => {

  it('renders a heading', async () => {

    // Get the Page component
    const page = await Page();

    // Render the page component
    render(page);

    // Find the reset password text
    const resetPasswordText = screen.getByText('Reset Password');

    // Check if the Reset Password Text exists
    expect(resetPasswordText).toBeInTheDocument();  

  })
})