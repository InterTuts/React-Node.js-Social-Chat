// Installed Utils
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import { Box } from '@chakra-ui/react';

// App Utils
import '@/lib/styles/globals.css';
import '@/lib/styles/auth/layout.scss';
import UserProvider from '@/lib/redux/UserProvider';
import { Provider } from '@/lib/components/ui/provider';
import StoreProvider from '@/lib/redux/StoreProvider';

export default async function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {

  // Get the language code
  const locale = await getLocale();
 
  // Get all messages
  const messages = await getMessages();
 
  return (
    <html lang={locale}>
      <body>
        <Provider>
          <NextIntlClientProvider messages={messages}>
            <StoreProvider>
              <Box bg="green.100" minH="100vh">
                <UserProvider>
                    {children}
                </UserProvider>
              </Box>
            </StoreProvider>
          </NextIntlClientProvider>          
        </Provider>
      </body>
    </html>
  );
}