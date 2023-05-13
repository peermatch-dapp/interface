import { gql, GraphQLClient } from 'graphql-request';

const airstack = new GraphQLClient('https://api.airstack.xyz/gql');

export async function runAirstackQuery(textQuery: string) {
  // return {};
  const query = gql`
    ${textQuery}
  `;
  const data = await airstack.request(query);
  // console.log(data);
  return data;
}

export async function runPoapQuery(textQuery: string) {
  // return {};
  const query = gql`
    ${textQuery}
  `;
  const data = await poapEndpoint.request(query);
  // console.log(data);
  return data;
}

async function contractsFinder(
  nftContracts: Record<string, Record<string, { name: string; logo: string }>>,
  tokenContracts: Record<
    string,
    Record<string, { name: string; logo: string }>
  >,
  addresses: string[],
  start: number
) {
  let query = '{';
  for (const [j, address] of addresses.entries()) {
    query += `
    balance${start + j}: TokenBalances(
      input: {filter: {owner: {_eq: "${address}"}, tokenType: {_in: [ERC1155, ERC721, ERC20]}}, blockchain: ethereum, limit: 100}
      ) {
        TokenBalance {
          tokenAddress
          token {
            name
            logo {
              original
            }
          }
          tokenType
        }
      }`;
  }
  query += '\n}';

  const data = (await runAirstackQuery(query)) as any;
  for (const [j, address] of addresses.entries()) {
    const username = `balance${start + j}`;
    nftContracts[address] = {};
    tokenContracts[address] = {};

    // console.log(data[username]);

    if (data[username]?.TokenBalance) {
      for (const tokenBalance of data[username]?.TokenBalance) {
        if (tokenBalance.tokenType === 'ERC20') {
          tokenContracts[address][tokenBalance?.tokenAddress] = {
            name: tokenBalance.token.name,
            logo: tokenBalance.token.logo.original
          };
        } else {
          nftContracts[address][tokenBalance?.tokenAddress] = {
            name: tokenBalance.token.name,
            logo: tokenBalance.token.logo.original
          };
        }
      }
    }
  }
}
const getOnchainScore = async (
  requester: string,
  candidates: string[]
): Promise<any> => {
  const limit = 5;
  let addresses = [requester, ...candidates];
  const nftContracts: Record<
    string,
    Record<string, { name: string; logo: string }>
  > = {};
  const tokenContracts: Record<
    string,
    Record<string, { name: string; logo: string }>
  > = {};
  for (let i = 0; i < Math.ceil(addresses.length / limit); i++) {
    const skip = i * limit;
    await contractsFinder(
      nftContracts,
      tokenContracts,
      addresses.slice(skip, skip + limit),
      skip
    );
  }

  const commonNfts: Record<
    string,
    Record<string, { name: string; logo: string }>
  > = {};
  const commonTokens: Record<
    string,
    Record<string, { name: string; logo: string }>
  > = {};
  for (const candidate of candidates) {
    commonNfts[candidate] = {};
    commonTokens[candidate] = {};
    for (const contractAddress in nftContracts[requester]) {
      if (Boolean(nftContracts[candidate][contractAddress])) {
        commonNfts[candidate][contractAddress] =
          nftContracts[candidate][contractAddress];
      }
    }
    for (const contractAddress in tokenContracts[requester]) {
      if (Boolean(tokenContracts[candidate][contractAddress])) {
        commonTokens[candidate][contractAddress] =
          tokenContracts[candidate][contractAddress];
      }
    }
  }

  const totalCommonNfts: Record<string, number> = {};
  for (const address in commonNfts) {
    totalCommonNfts[address] = Object.keys(commonNfts[address]).length;
  }
  const totalCommonTokens: Record<string, number> = {};
  for (const address in commonTokens) {
    totalCommonTokens[address] = Object.keys(commonTokens[address]).length;
  }

  const commonPoaps = await getCommonPoaps(requester, candidates);

  return {
    nftContracts,
    tokenContracts,
    totalCommonNfts,
    totalCommonTokens,
    commonNfts,
    commonTokens,
    commonPoaps
  };
};

const poapEndpoint = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai'
);

export async function getPoaps(
  addresses: string[],
  start: number,
  events: Record<string, Record<string, boolean>>
) {
  let query = `{
    minted: account(id: "${addresses[0].toLowerCase()}") {
      tokens(first: 1000) {
        event {
          id
        }
      }
    }
  }`;

  const data = (await runPoapQuery(query)) as any;
  console.log(data);
  const username = `minted`;
  events[addresses[0]] = {};

  if (data[username]?.tokens) {
    for (const token of data[username]?.tokens) {
      events[addresses[0]][token.event.id] = true;
    }
  }
}

export async function getCommonPoaps(requester: string, candidates: string[]) {
  const addresses = [requester, ...candidates];
  const events: Record<string, Record<string, boolean>> = {};
  const limit = 1;

  for (let i = 0; i < Math.ceil(addresses.length / limit); i++) {
    const skip = i * limit;
    await getPoaps(addresses.slice(skip, skip + limit), skip, events);
  }

  const commonEvents: Record<string, Record<string, boolean>> = {};
  for (const candidate of candidates) {
    commonEvents[candidate] = {};
    for (const eventId in events[requester]) {
      if (Boolean(events[candidate][eventId])) {
        commonEvents[candidate][eventId] = true;
      }
    }
  }

  const totalCommonPoaps: Record<string, number> = {};
  for (const address in commonEvents) {
    totalCommonPoaps[address] = Object.keys(commonEvents[address]).length;
  }

  return totalCommonPoaps;
}

export default getOnchainScore;
