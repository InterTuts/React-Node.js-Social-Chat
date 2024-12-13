'use client'

// Installed Utils
import {useTranslations} from 'next-intl';
import { useSelector, useDispatch } from 'react-redux';

// App Utils
import { RootState, AppDispatch } from '@/lib/redux/store';
import { logout } from '@/lib/redux/features/user/userSlice';
import {
    Box,
    Flex,
    Link,
    Input,
    Icon,
    Button,
    List
  } from "@chakra-ui/react";
  import {
    HiExternalLink,
    HiUserAdd,
    HiSearch,
    HiDocumentText
  } from "react-icons/hi";
  import { HStack } from "@chakra-ui/react"
  import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot,
  } from "@/lib/components/ui/pagination"

// Create the user's threads component
const Threads = () => {

    // Get the words by group
    const t = useTranslations('auth');

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    // Get the user's info
    const { user } = useSelector((state: RootState) => state.user);

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
                <Icon
                  verticalAlign="top"
                  marginLeft="2px"
                  fontSize="xl"
                  >
                  <HiExternalLink />
                </Icon>
              </Link>
          </Flex>
        </Box>
        <Box py={4} px={4}>
          <Flex
            justifyContent={'space-between'}
            bgColor={ 'rgba(255, 255, 255, 0.1)' }
          >
            <Icon
              verticalAlign="top"
              marginTop="9px"
              marginLeft="10px"
              fontSize="xl"
              >
              <HiSearch />
            </Icon>          
            <Input
              type="text"
              placeholder="Search for threads ..."
              paddingX="15px"
              paddingY="5px"
              fontFamily="input"
              fontSize="14px"
            />
            <Button
              paddingX="20px"
              paddingY="10px"
              borderLeft="1px solid"
              borderRadius={0}
              borderColor="rgba(0, 0, 0, 0.1)"
              fontFamily="button"
              fontSize="14px"
            >
              <Icon
                verticalAlign="top"
                marginLeft="2px"
                fontSize="xl"
                >
                <HiUserAdd />
              </Icon>
              Accounts
            </Button>
          </Flex>
        </Box>
        <Box px={4}>
          <List.Root className="chakra-list">
            <List.Item>
              <Link className="new-message">
                <Flex justifyContent={'space-between'}>
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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
                  <Box>
                    <Icon
                      verticalAlign="sub"
                      marginRight="5px"
                      fontSize="xl"
                    >
                      <HiDocumentText />
                    </Icon>
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