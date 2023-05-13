import { HttpLink } from '@apollo/client';

const airstackLink = new HttpLink({
  uri: 'https://api.airstack.xyz/gql',
  fetchOptions: 'no-cors',
  fetch
});

export default airstackLink;
