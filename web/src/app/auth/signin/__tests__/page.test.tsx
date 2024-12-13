// Installed Utils
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

// App Utils
import Page from '../page';

// Mock Sign In page
jest.mock('../../../forms/AuthSignIn', () => () => null);

describe('Sign In Page', () => {

  it('renders a heading', async () => {

    // Get the Page component
    const page = await Page();

    // Render the page component
    render(page);

    // Find the sign in text
    const signInText = screen.getByText('Sign In to MyApp');

    // Check if the Sign In Text exists
    expect(signInText).toBeInTheDocument();
    
    // Find the image by its alt text
    const image = screen.getByAltText('Icon');

    // Check if the image is in the document
    expect(image).toBeInTheDocument();

    // Check if the image has the correct src attribute
    expect(image).toHaveAttribute('src', '/google-icon.png');

    // Find the or text
    const orText = screen.getByText('OR');

    // Check if the Or Text exists
    expect(orText).toBeInTheDocument();    

  })
})