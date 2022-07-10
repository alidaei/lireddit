import React from 'react';
import Link from 'next/link';
import { Box, Button, Link as ChakraLink, Text } from '@chakra-ui/react';

import { useLogoutMutation, useMeQuery } from '../generated/graphql';

const NavBar: React.FC = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
    // data is fetching
  } else if (!data?.me) {
    // user is not logged in
    body = (
      <React.Fragment>
        <Link href={'/login'}>
          <ChakraLink mr={4} color="c_gray">
            Login
          </ChakraLink>
        </Link>
        <Link href={'/register'}>
          <ChakraLink color="c_gray">Register</ChakraLink>
        </Link>
      </React.Fragment>
    );
  } else {
    //user is logged in
    body = (
      <Box display="flex">
        <Box mr={4} color="c_gray">
          {data?.me.username}
        </Box>
        <Box>
          <Button
            variant={'link'}
            color="c_gray"
            isLoading={logoutFetching}
            onClick={() => logout()}
          >
            Logout
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={4}
    >
      <div>
        <Text fontSize={20} fontWeight={500}>
          Lirredit Clone
        </Text>
      </div>
      <div>{body}</div>
    </Box>
  );
};

export { NavBar };
