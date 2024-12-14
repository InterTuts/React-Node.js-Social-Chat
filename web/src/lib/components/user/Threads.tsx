'use client'

// Installed Utils
import {useTranslations} from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Flex,
  Link,
  Input,
  Icon,
  Button,
  List,
  Tabs,
  Image,
  Group,
  IconButton
} from "@chakra-ui/react";
import {
  HiExternalLink,
  HiUserAdd,
  HiSearch,
  HiDocumentText,
  HiTrash
} from "react-icons/hi";
import { HStack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/lib/components/ui/pagination";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/lib/components/ui/dialog";
import { useState } from 'react';

// App Utils
import { RootState, AppDispatch } from '@/lib/redux/store';
import { logout } from '@/lib/redux/features/user/userSlice';

// Create the user's threads component
const Threads = () => {
  const [openDialog, setDialogOpen] = useState(false);

  const [selectedNetwork, setSelectedNetwork] = useState<string | null>("facebook")

    // Get the words by group
    const t = useTranslations('account');

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get the user's info
    const { user } = useSelector((state: RootState) => state.user);

    /**
     * Connect social accounts
     * 
     * @param network 
     */
    const connectAccounts = (network: string) => {

      // Set popup's url
      const popup_url = process.env.NEXT_PUBLIC_API_URL + 'networks/connect/' + network;

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
     * Handle logout button click
     */
    const handleLogout = () => {
      dispatch(logout());
    };

    return (
        <>
        <Box bg={'white'} px={4}>
          <Flex h={16} justifyContent={'space-between'}>
              <Box
                marginTop={2}
                fontFamily="logo"
                fontSize={32}
                fontWeight={400}
                color="violet.100"
              >Chat</Box>
              <Link
                alignItems="normal"
                marginTop="13px"
                paddingY="7px"
                paddingX="15px"
                height={35}
                fontFamily="button"
                fontSize="14px"
                bg="brown.100"
                color="dark.100"
                href="#"
                _hover={{
                  textDecoration: "none",
                  bg: "brown.200",
                  color: "white"
                }}
                onClick={handleLogout}
              >
                {t('sign_out')}
                <Box verticalAlign="top"
                  marginLeft="2px"
                  fontSize="xl">
                  <HiExternalLink />
                </Box>
              </Link>
          </Flex>
        </Box>
        <Box py={4} px={4}>
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
              placeholder="Search for threads ..."
              paddingX="15px"
              paddingY="5px"
              fontFamily="input"
              fontSize="14px"
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
                      <Tabs.Trigger value="instagram">
                        <Image src="/in.png" alt="Instagram Icon" />
                      </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="facebook">
                      <Button bgColor="#0866ff" color="#FFFFFF" width="100%" onClick={() => connectAccounts('facebook')}>
                        { t('connect_pages') }
                      </Button>
                      <Box>
                        <Group attached className="network-account">
                          <Button variant="outline" size="sm">
                            Button
                          </Button>
                          <Box>
                            <HiTrash size="sm" />
                          </Box>
                        </Group>
                      </Box>
                    </Tabs.Content>
                    <Tabs.Content value="instagram">
                      <Button bgColor="#405DE6" color="#FFFFFF" width="100%" onClick={() => connectAccounts('instagram')}>
                        { t('connect_accounts') }
                      </Button>
                    </Tabs.Content>
                  </Tabs.Root>
                </DialogBody>
                <DialogCloseTrigger />
              </DialogContent>
            </DialogRoot>
          </Flex>
        </Box>
        <Box px={4}>
          <List.Root className="chakra-list">
            <List.Item>
              <Link className="new-message">
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
                    Item 1
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 2
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 3
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 4
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 5
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 6
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 7
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 8
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 9
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
            <List.Item>
              <Link>
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
                    Item 10
                  </Box>
                  <Box lineHeight="25px" fontSize="13px" color="grey.100">
                    15 minutes ago
                  </Box>
                </Flex>
              </Link>
            </List.Item>
          </List.Root>
        </Box>
        <Box display={'flex'} justifyContent={'space-between'} px={4} py={4} fontFamily="button" fontSize="14px" color="black.100">
          <Box>
            1 - 5 of 200
          </Box>
          <PaginationRoot
            count={10}
            pageSize={2}
            defaultPage={1}
            size="xs"
          >
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Box>          
      </>);

}

// Export the user's threads component
export default Threads;