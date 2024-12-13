// Installed Utils
import '@testing-library/jest-dom';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Global Mock for Next Intl
jest.mock('next-intl/server', () => ({
  ...jest.requireActual('next-intl/server'),
  unstable_setRequestLocale: jest.fn(),
  getTranslations: jest.fn().mockImplementation(async (namespace) => {

    // Get all words
    const words: { [namespace: string]: { [key: string]: string } } = (await import(`../messages/en.json`)).default;

    // Return the requested key
    return (key: string) => words[namespace][key];

  }),
}));