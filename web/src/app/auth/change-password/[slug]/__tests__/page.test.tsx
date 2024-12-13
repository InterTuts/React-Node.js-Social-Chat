// Installed Utils
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// App Utils
import Page from '../page';

// Mock the AuthChangePassword component
jest.mock('../../../../forms/AuthChangePassword', () => {
  return {
    __esModule: true,
    default: jest.fn(({ code }: { code: string }) => (
      <div data-code={code} />
    )),
  };
});

describe('Change Password Page', () => {

  it('renders a heading', async () => {

    // Define the mock params
    const mockParams = { params: { slug: 'slug' } };

    // Get the Page component
    const page = await Page(mockParams);

    // Render the page component
    render(page);

    // Find the new password text
    const newPasswordText = screen.getByText('New Password');

    // Check if the New Password Text exists
    expect(newPasswordText).toBeInTheDocument();  

  })
})