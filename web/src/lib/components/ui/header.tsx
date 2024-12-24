'use client';

// System Utils
import { MouseEvent } from 'react';

// Installed Utils
import {useTranslations} from 'next-intl';
import { useDispatch } from 'react-redux';
import {
    Box,
    Flex,
    Link
  } from "@chakra-ui/react";
  import {
    HiExternalLink
  } from "react-icons/hi";

// App Utils
import { AppDispatch } from '@/lib/redux/store';
import { logout } from '@/lib/redux/features/user/userSlice';

// Reusable header component for user's panel
const Header = () => {

    // Get the words by group
    const t = useTranslations('account');

    // Get the Redux's dispatch
    const dispatch = useDispatch<AppDispatch>();

    /**
     * Handle logout button click
     */
    const handleLogout = (e: MouseEvent) => {
      e.preventDefault();
      dispatch(logout());
    };

    return (
    <Box bg={'white'} px={4}>
        <Flex h={16} justifyContent={'space-between'}>
            <Box
              marginTop={2}
              fontFamily="logo"
              fontSize={32}
              fontWeight={400}
              color="violet.100"
            >
              <Link href="/">
                { t('chat') }
              </Link>
            </Box>
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
              onClick={(e) => handleLogout(e)}
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
    );
    
}

export default Header;