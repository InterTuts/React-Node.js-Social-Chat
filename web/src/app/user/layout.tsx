
import { Box } from "@chakra-ui/react";

import UserProvider from '@/lib/redux/UserProvider';

export default function UserLayout({children}: {children: React.ReactNode}) {
    return (
        <>
            <UserProvider>
                {children}
            </UserProvider>
        </>
    );

}