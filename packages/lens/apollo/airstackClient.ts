import { ApolloClient, from, InMemoryCache } from '@apollo/client';

import airstackLink from './airstackLink';

const airstackClient = new ApolloClient({
  link: from([airstackLink]),
  cache: new InMemoryCache()
});

export default airstackClient;
