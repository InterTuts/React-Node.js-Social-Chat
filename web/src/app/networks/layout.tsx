// Installed Utils
import {getLocale, getMessages} from 'next-intl/server';

// App Utils
import { Provider } from '@/lib/components/ui/provider';
import { NextIntlClientProvider } from 'next-intl';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
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
            {children}
          </NextIntlClientProvider>
        </Provider>
      </body>
    </html>
  )
}
