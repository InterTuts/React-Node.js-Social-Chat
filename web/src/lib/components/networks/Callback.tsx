'use client'

// System Utils
import { JSX, useEffect } from 'react';

// Installed Utils
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

// App Utils
import axios, { type AxiosResponse } from '@/axios';
import ApiResponse from '@/lib/models/ApiResponse';

/**
 * Sanitize the authorization code
 * 
 * @param code
 * 
 * @returns safe code 
 */
const sanitizeCode = (code: string): string => {
    return code.replace(/[^a-zA-Z0-9-_]/g, '');
}

// Save networks accounts callback component
const Callback = ({ slug }: { slug: string }): JSX.Element => {

    // Get the words by group
    const t = useTranslations('account');

    // Access URL's query parameters
    const searchParams = useSearchParams();

    // Extract the code query parameter
    const code = searchParams.get('code');

    // Sanitize the code
    const sanitizedCode = sanitizeCode(code ?? '');

    useEffect(() => {
        
        async function loadData() {
            try {

                // Get the authentication redirect
                const response: AxiosResponse<ApiResponse<string>> = await axios.post(`api/user/token/${slug}`, {
                    code: sanitizedCode
                });
                
                console.log(response);

            } catch (error: unknown) {

                // Get the error message
                const message = ( error instanceof Error )?error.message:error as string;

            }
        }
    
        loadData();

    }, [sanitizedCode, slug, t]);

    return (
        <>{ sanitizedCode }</>
    );

};

// Export the networks accounts callback component
export default Callback;