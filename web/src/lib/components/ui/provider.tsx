'use client';

import { ChakraProvider } from '@chakra-ui/react';

import defaultTheme from '@/lib/themes/default';

export function Provider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={defaultTheme}>
      {props.children}
    </ChakraProvider>
  );
}