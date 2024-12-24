// System Utils
import type { Metadata } from 'next';

// Installed Utils
import { getTranslations } from 'next-intl/server';
import { Box } from '@chakra-ui/react';

// App Utils
import Header from '@/lib/components/ui/header';
import Chat from '@/lib/components/user/Chat';
import Threads from '@/lib/components/user/Threads';

// Page's Title and Description
export async function generateMetadata(): Promise<Metadata> {
    // Get the words by group
    const t = await getTranslations('account');  
    return {
      title: t('chat'),
      description: t('chat_description')
    }
  }

export default async function Page({params}: {params: {slug: string}}) {
  return (<>
    <Header />
    <Box display="flex" flexDirection={{ base: 'column', md: 'row' }} width="100%">
      <Box width={{ base: '100%', "2xl": "40%", "xl": "50%", "lg": "100%", "md": "100%" }}>
        <Threads threadId={params.slug} />
      </Box>
      <Box width={{ base: '100%', "2xl": "60%", "xl": "50%", "lg": "100%", "md": "100%" }}>
        <Chat threadId={params.slug} /> 
      </Box>          
    </Box>
  </>);
}