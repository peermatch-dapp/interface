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

  return {
    nftContracts,
    tokenContracts,
    totalCommonNfts: Object.keys(commonNfts).length,
    totalCommonTokens: Object.keys(commonTokens).length,
    commonNfts,
    commonTokens
  };
};

const poapEndpoint = new GraphQLClient(
  'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai'
);

export async function getPoaps(requester: string, candidates: string[]) {
  const addresses = [requester, ...candidates];
  const poaps = [];
}

export async function getAllNFTs(requester: string) {
  const data = await runAirstackQuery(`query yashgoyal {
    ethereum: Wallet(input: {identity: "yashgoyal.eth", blockchain: ethereum}) {
      domains {
        name
        owner
      }
      primaryDomain {
        name
        owner
      }
      socials {
        dappName
        profileName
      }
      tokenBalances {
        token {
          name
          symbol
          address
          blockchain
        }
        amount
        tokenId
        tokenType
        tokenNfts {
          tokenId
          contentValue {
            image {
              original
            }
          }
        }
      }
    }
    polygon: Wallet(input: {identity: "yashgoyal.eth", blockchain: polygon}) {
      domains {
        name
        owner
      }
      primaryDomain {
        name
        owner
      }
      socials {
        dappName
        profileName
      }
      tokenBalances {
        token {
          name
          symbol
          address
          blockchain
        }
        amount
        tokenId
        tokenType
        tokenNfts {
          tokenId
          contentValue {
            image {
              original
            }
          }
        }
      }
    }
  }`);

  console.log(data);
  return data;
}

export default getOnchainScore;
