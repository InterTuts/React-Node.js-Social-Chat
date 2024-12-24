'use client'

// System Utils
import { MouseEvent } from 'react';
import Link from 'next/link';

// Installed utils
import {useTranslations} from 'next-intl';
import {
  HiArrowRight,
  HiArrowLeft
} from "react-icons/hi";
import {
    Box,
    List
} from '@chakra-ui/react';

// Create the Pagination
const Pagination: React.FC<{page: number, total: number, limit: number, onDataSend: (data: string) => void}> = ({page, total, limit, onDataSend}): React.JSX.Element => {

    // Get the words by group
    const t = useTranslations('account');

    /**
     * Change page number
     * 
     * @param e 
     * @param page 
     */
    const changePage = (e: MouseEvent, page: number) => {
        e.preventDefault();
        onDataSend(page.toString());
    };

    // Count pages
    const totalPages: number = Math.ceil(total / limit) + 1;

    // Generate the pages
    const pagesList = (): React.JSX.Element[] => {

        // Calculate start page
        const from: number = (page > 2) ? (page - 2) : 1;

        // Initialize an array to store the pages JSX elements
        const pages: React.JSX.Element[] = [];
        
        // List all pages
        for ( let p: number = from; p < totalPages; p++ ) {
            
            // Verify if p is equal to current page
            if (p === page) {

                // Add current page
                pages.push(<List.Item key={p} className="page-item active">
                    <Link href="#" className="page-link" onClick={(e) => changePage(e, p)}>
                        {p}
                    </Link>
                </List.Item>);

            } else if ((p < page + 3) && (p > page - 3)) {

                // Add page number
                pages.push(<List.Item key={p} className="page-item">
                    <Link href="#" className="page-link" onClick={(e) => changePage(e, p)}>
                        {p}
                    </Link>
                </List.Item>);

            } else if ((p < 6) && (totalPages > 5) && ((page === 1) || (page === 2))) {

                // Add page number
                pages.push(<List.Item key={p} className="page-item">
                    <Link href="#" className="page-link" onClick={(e) => changePage(e, p)}>
                        {p}
                    </Link>
                </List.Item>);

            } else {
                break;
            }

        }

        // Render the pages
        return pages;

    }

    // Set limit for threads
    const threadsLimit: number = ((page * limit) < total)?(page * limit):total;

    // Set displayed number of threads
    const displayed_threads = (((page - 1) * limit) + 1) + '-' + threadsLimit + ' ' + t('of') + ' ' + total + ' ' + t('results');

    return (
        <>
            <Box>
                { displayed_threads }
            </Box>
            <List.Root className="flex navigation">
            {( page > 1 )? (
                <List.Item className="page-item">
                    <Link href="#" className="page-link" onClick={(e) => changePage(e, page - 1)}>
                        <HiArrowLeft />
                    </Link>
                </List.Item>
            ): (
                <List.Item className="page-item disabled">
                    <Link href="#" className="page-link">
                        <HiArrowLeft />
                    </Link>
                </List.Item>
            )}
            { pagesList() }
            {((page + 1) < totalPages)?(
                <List.Item className="page-item">
                    <Link href="#" className="page-link" onClick={(e) => changePage(e, page + 1)}>
                        <HiArrowRight />
                    </Link>
                </List.Item>
            ):(
                <List.Item className="page-item disabled">
                    <Link href="#" className="page-link">
                        <HiArrowRight />
                    </Link>
                </List.Item>
            )}
        </List.Root>
        </>
    );

}

// Export the pagination
export default Pagination;