// System Utils
import React, { PropsWithChildren } from 'react';
// Installed Utils
import type { RenderOptions } from '@testing-library/react';
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Provider } from 'react-redux';

// App Utils
import type { AppStore, RootState } from '@/lib/redux/store';
import { makeStore } from '@/lib/redux/store';


// This is an interface for render options
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

// Render a component using default providers
export default async function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {}, // Allow passing preloaded state as an argument
    // Automatically create a store instance if no store was passed in
    store = makeStore(), // Initialize the store with preloaded state
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Get all words
  const words: { [namespace: string]: { [key: string]: string } } = (await import(`../messages/en.json`)).default;

  /**
   * Apply providers to a children
   * 
   * @param children React.ReactNode
   * @returns JSX.Element
   */
  const Wrapper = ({ children }: PropsWithChildren<{}>): JSX.Element => {
    return (
      <NextIntlClientProvider locale="en" messages={words}>
        <Provider store={store}>
          {children}
        </Provider>
      </NextIntlClientProvider>
    );
  };

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}