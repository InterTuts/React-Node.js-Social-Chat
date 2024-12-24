'use client'

// System Utils
import { JSX, useEffect, useState } from 'react';

// Installed Utils
import { useRouter } from 'next/navigation';
import {useTranslations} from 'next-intl';
import { Box } from '@chakra-ui/react';
import { HiBell } from 'react-icons/hi';

// App Utils
import axios, { type AxiosResponse } from '@/axios';
import ApiResponse from '@/lib/models/ApiResponse';

// Create the networks account connect component
const Connect = ({ slug }: { slug: string }): JSX.Element => {

    // Get the router hook
    const router = useRouter();

    // Get the words by group
    const t = useTranslations('account');

    // Message holder
    const [message, setMessage] = useState<string | null>(null);  

    // Errors holder
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        
        async function loadData() {
            try {

                // Get the authentication redirect
                const response: AxiosResponse<ApiResponse<string>> = await axios.get(`api/user/connect/${slug}`);
                
                // Verify if url is successfully
                if (response.data.success) {
                    //router.push(response.data.content ?? '');
                    setMessage(response.data.message);
                    // Wait until the message is showed
                    setTimeout(function () {
                        // Verify if opener exists
                        if (window.opener) {
                        // Reload accounts
                        window.opener.dispatchEvent(new Event('reloadAccounts'));
                        }

                        // Close modal
                        window.close();
                    }, 1500);
                } else {
                    setError(response.data.message);
                }

            } catch (error: unknown) {

                // Get the error message
                const message = ( error instanceof Error )?error.message:error as string;

                // Update the error
                setError(t('error_fetching_data') + ': ' + message);

            }
        }
    
        loadData();

    }, [router, slug, t]);

    return (
        <>
            {(message)?(
                <Box
                    m="15px"
                    p="10px 15px"
                    fontFamily="message"
                    fontSize="14px"
                    bg="blue.100"
                    color="black.100"
                >
                    <Box
                        display="inline-block"
                        verticalAlign="top"
                        marginRight="5px"
                        fontSize="xl"
                    >
                        <HiBell />
                    </Box>
                    { message }
                </Box>            
            ):''} 
            {(error)?(
                <Box
                    m="15px"
                    p="10px 15px"
                    fontFamily="message"
                    fontSize="14px"
                    bg="red.100"
                    color="black.100"
                >
                    <Box
                        display="inline-block"
                        verticalAlign="top"
                        marginRight="5px"
                        fontSize="xl"
                    >
                        <HiBell />
                    </Box>
                    { error }
                </Box>            
            ):''}
        </>
    );

};

// Export the networks account connect component
export default Connect;