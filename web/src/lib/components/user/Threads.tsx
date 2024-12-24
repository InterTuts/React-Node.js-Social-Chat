'use client'

// Installed Utils
import {useTranslations} from 'next-intl';
import {
  Box,
  Flex,
  Link,
  Input,
  Button,
  List,
  Tabs,
  Image,
  Group
} from "@chakra-ui/react";
import {
  HiUserAdd,
  HiSearch,
  HiDocumentText,
  HiTrash
} from "react-icons/hi";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { SetStateAction, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import clsx from 'clsx';

// App Utils
import type ApiResponse from '@/lib/models/ApiResponse';
import type { Account } from '@/lib/models/Account';
import axios, { type AxiosResponse } from '@/axios';
import Pagination from '@/lib/components/ui/pagination';
import { calculateTime, toTimeStamp } from '@/lib/utils/time';

// Create the user's threads component
const Threads = ({ threadId }: { threadId: string }) => {

  // Modal status
  const [openDialog, setDialogOpen] = useState(false);

  // Networks tab
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>("facebook");

  // Networks list
  const [networksList, setNetworksList] = useState<{
    facebook_pages: Account[]
  } | {}>({});

  // Set a hook for loading threads
  const [isLoading, setIsLoading] = useState(true);

  // Set a hook for pagination
  const [pagination, setPagination] = useState<{
    page: number,
    total: number,
    limit: number,
    items: React.JSX.Element[]        
  }>({
    page: 1,
    total: 0,
    limit: 10,
    items: []
  });  

  // Create a state variable for the search value
  const [searchValue, setSearchValue] = useState('');

  // Event handler for input change
  const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setSearchValue(e.target.value);
    // Get the threads list
    threadsList(1, e.target.value as string);
  };

  /**
   * Sanitize the thread's id
   * 
   * @param threadId
   * 
   * @returns sanitized thread's id
   */
  const sanitizeThreadId = (threadId: string): string => {
    return threadId?threadId.replace(/[^a-zA-Z0-9-_]/g, ''):'';
  }

  // Santize the thread's ID
  const sanitizedThreadId = sanitizeThreadId(threadId);

  // Get the words by group
  const t = useTranslations('account');

  // Detect changes for modal
  useEffect(() => {

    // Check if modal is showed with networks
    if ( openDialog ) {
      accountsList();
    }

  }, [openDialog]);

  // Run code after page load
  useEffect(() => {

    // Get the threads list
    threadsList(1);

    // Reload the accounts list
    const reloadAccountsHandler = () => {
      accountsList();
    };

    // Listen for the custom event
    window.addEventListener('reloadAccounts', reloadAccountsHandler);

    // Cleanup
    return () => {
      window.removeEventListener('reloadAccounts', reloadAccountsHandler);
    };

  }, []);

  /**
   * Connect social accounts
   * 
   * @param network 
   */
  const connectAccounts = (network: string) => {

    // Set popup's url
    const popup_url = process.env.NEXT_PUBLIC_WEBSITE_URL + 'networks/connect/' + network;

    // Get popup's position from left
    const from_left =
      window.screenLeft != undefined ? window.screenLeft : window.screenX;

    // Get popup's width
    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;

    // Get popup's height
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;

    // Calculate new left poition
    const left = width / 2 - width / 2 / 2 + from_left;

    // Set default top position
    const top = 50;

    // Open popup
    const networkWindow = window.open(
      popup_url,
      'Connect Account',
      'scrollbars=yes, width=' +
        width / 2 +
        ', height=' +
        height / 1.3 +
        ', top=' +
        top +
        ', left=' +
        left,
    );

    // Set focus
    if (typeof window.focus === 'function' && networkWindow) {
      networkWindow.focus();
    }

  };

  /**
   * Get all threads
   * 
   * @param number page
   * @param string search
   */
  const threadsList = async (page: number, search: string = '') => {

    // Enable is loading
    setIsLoading(true);

    // Empty items
    setPagination((prev) => ({
      ...prev,
      total: 0,
      items: []
    }));

    try {

      // Get the user's threads
      const response: AxiosResponse<ApiResponse<
      {
        threads: {
          createdAt: string,
          label_id: string,
          _id: string
        }[],
        total: number,
        time: string
      }
      >> = await axios.post(`api/user/threads`, {
        search: search,
        page: page
      });

      // Verify if threads exists
      if ( response.data.success && response.data.content ) {

        // Initialize an array to store the pages JSX elements
        const items: React.JSX.Element[] = [];

        // List the items
        for ( const thread of response.data.content.threads ) {

          // Add current page
          items.push(<List.Item key={ thread._id }>
            <Link href={ "/user/threads/" + thread._id } className={"new-message" + clsx({ " message-active": (thread._id === sanitizedThreadId) })}>
              <Flex justifyContent={'space-between'}>
                <Box paddingTop="3px">
                  <Box
                    display="inline-block"
                    verticalAlign="top"
                    marginRight="5px"
                    fontSize="xl"
                  >
                    <HiDocumentText />
                  </Box>
                  { thread.label_id }
                </Box>
                <Box className="message-time">
                { calculateTime(t, toTimeStamp(thread.createdAt)/1000, toTimeStamp(response.data.content.time)/1000) }
                </Box>
              </Flex>
            </Link>
          </List.Item>);

        }

        // Set items
        setPagination((prev) => ({
          ...prev,
          total: response.data.content!.total,
          items: items
        }));
        
      }

    } catch (error) {
      console.error(error);
    } finally {
      // Disable is loading
      setIsLoading(false);
    }
    
  };

  /**
   * Get all networks and their accounts
   */
  const accountsList = async () => {

    // Empty the accounts
    setNetworksList({});

    try {

      // Get the networks with their accounts
      const response: AxiosResponse<ApiResponse<
      {
        _id: string;
        name: string;
        network_name: string;
      }[]
      >> = await axios.get(`api/user/networks`);

      // Verify if networks with accounts exists
      if (response.data.success && response.data.content) {
        
        // Container for networks with accounts
        const networks: {[key: string]: 
          Account[]          
        } = {
          facebook_pages: []
        };

        // Total number of accounts
        const totalAccounts = response.data.content.length;

        // List all accounts
        for (let a = 0; a < totalAccounts; a++) {
          if (response.data.content[a].network_name === 'facebook_pages') {
            networks.facebook_pages.push({
              id: response.data.content[a]._id,
              name: response.data.content[a].name
            });
          }
        }
        
        // Save the accounts
        setNetworksList(networks);

      }

    } catch (error) {
      console.error(error);
    }

  };

  const deleteAccount = async (network: string, account: string) => {

    try {

      // Get the networks with their accounts
      const response: AxiosResponse<ApiResponse<string>> = await axios.delete(`api/user/networks/${network}/${account}`);
      
      // Verify if the account was deleted successfuly
      if ( response.data.success ) {

        // Display the success message
        toast(response.data.message, {
          style: {
            background: '#319795',
            color: '#FFFFFF'
          }
        });

        // Delete account
        accountsList();

        // Reload the threads list
        threadsList(1, searchValue);

      } else {

        // Display the failed message
        toast(response.data.message, {
          style: {
            background: '#ef476f',
            color: '#FFFFFF'
          }
        });

      }

    } catch (error) {
      console.error(error);
    }

  };

  /**
   * Navigate through the pages
   * 
   * @param number page
   */
  const changePage = (page: string) => {
    // Change page number
    setPagination((prev) => ({
      ...prev,
      page: parseInt(page)
    }));
    // Get the threads list
    threadsList(parseInt(page), searchValue);
  };

  return (
      <>
      <Box py={4} px={4}>
        <Toaster />
        <Flex
          justifyContent={'space-between'}
          bgColor={ 'rgba(255, 255, 255, 0.1)' }
        >
          <Box
            verticalAlign="top"
            marginTop="9px"
            marginLeft="10px"
            fontSize="xl"
            >
            <HiSearch />
          </Box>          
          <Input
            type="text"
            placeholder={ t('search_for_threads') }
            paddingX="15px"
            paddingY="5px"
            fontFamily="input"
            fontSize="14px"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <DialogRoot lazyMount open={openDialog} onOpenChange={(e) => setDialogOpen(e.open)}>
            <DialogTrigger asChild>
              <Button
                paddingX="20px"
                paddingY="10px"
                borderLeft="1px solid"
                borderRadius={0}
                borderColor="rgba(0, 0, 0, 0.1)"
                fontFamily="button"
                fontSize="14px"
              >
                <Box
                  verticalAlign="top"
                  marginLeft="2px"
                  fontSize="xl"
                  >
                  <HiUserAdd />
                </Box>
                { t('accounts') }
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader paddingY="10px" paddingX="15px">
                <DialogTitle fontFamily="header" fontSize="16px">
                  { t('accounts') }
                </DialogTitle>
              </DialogHeader>
              <DialogBody paddingX="15px">
                <Tabs.Root orientation="vertical" value={selectedNetwork} onValueChange={(e) => setSelectedNetwork(e.value)} className="networks-tabs">
                  <Tabs.List>
                    <Tabs.Trigger value="facebook">
                      <Image src="/fb.png" alt="Facebook Icon" />
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="facebook">
                    <Button bgColor="#0866ff" color="#FFFFFF" width="100%" onClick={() => connectAccounts('facebook')}>
                      { t('connect_pages') }
                    </Button>
                    <Box>
                    {Object.keys(networksList).length > 0 && (networksList as { facebook_pages: Account[]; }).facebook_pages.length > 0 ? (
                      (networksList as { facebook_pages: Account[]; }).facebook_pages.map((account, index) => (
                        <Group attached className="network-account" key={index}>
                          <Button variant="outline" size="sm">
                            {account.name}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => deleteAccount('facebook', account.id)}>
                            <HiTrash style={{ fontSize: "14px" }} />
                          </Button>
                        </Group>
                      ))
                    ) : <Box className="no-accounts-found">{ t('no_pages_were_found') }</Box>}
                    </Box>
                  </Tabs.Content>
                </Tabs.Root>
              </DialogBody>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
        </Flex>
      </Box>
      <Box px={4}>
        <List.Root className="list">
          { (pagination.items.length > 0)?pagination.items:(
            <List.Item p="10px 15px" fontFamily="message" fontSize="14px" color="black.100">
              { t('no_threads_were_found') }
            </List.Item>
          ) }
        </List.Root>
      </Box>
      {(!isLoading && (pagination.items.length > 0))?(
        <Box display={'flex'} justifyContent={'space-between'} px={4} py={4} fontFamily="button" fontSize="14px" color="black.100">
          <Pagination page={pagination.page} total={pagination.total} limit={pagination.limit} onDataSend={changePage} />
        </Box>         
      ):''}
    </>);

}

// Export the user's threads component
export default Threads;