// System Utils
import type { Metadata } from 'next';

// Installed Utils
import { getTranslations } from 'next-intl/server';

// Page's Title and Description
export async function generateMetadata(): Promise<Metadata> {
    // Get the words by group
    const t = await getTranslations('account');  
    return {
      title: t('threads'),
      description: t('threads_description')
    }
  }

// App Utils
import Threads from '@/lib/components/user/Threads';

export default async function Page() {

    return (<>
      <p>2</p>
    </>);

}