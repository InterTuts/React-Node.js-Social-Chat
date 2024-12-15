// System Utils
import { JSX } from 'react';

// Installed Utils
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

// App utils
import Connect from '@/lib/components/networks/Connect';

// Page's Title and Description
export async function generateMetadata(): Promise<Metadata> {
  // Get the words by group
  const t = await getTranslations('account');  
  return {
    title: t('connect_accounts'),
    description: t('connect_accounts_description')
  }
}

/**
 * Sanitize the slug
 * 
 * @param slug 
 * 
 * @returns safe slug 
 */
const sanitizeSlug = (slug: string): string => {
  return slug.replace(/[^a-zA-Z0-9-_]/g, '');
}

/**
 * Connect accounts page
 * 
 * @param params
 * 
 * @returns promise with jsx content
 */
export default async function Page({ params }: { params: { slug: string } } ): Promise<JSX.Element> {

  // Extract the slug
  const { slug } = params;

  // Sanitize the slug
  const sanitized_slug = sanitizeSlug(slug);

  return <Connect slug={sanitized_slug} />;

};