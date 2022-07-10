import React from 'react';
import { withUrqlClient } from 'next-urql';

import { NavBar } from '../components/NavBar';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => (
  <React.Fragment>
    <NavBar />
  </React.Fragment>
);

export default withUrqlClient(createUrqlClient)(Index);
