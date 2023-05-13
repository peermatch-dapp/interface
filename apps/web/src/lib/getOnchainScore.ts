import { gql, GraphQLClient } from 'graphql-request';

const airstack = new GraphQLClient('https://api.airstack.xyz/gql');

export async function runAirstackQuery(textQuery: string) {
  // return {};
  const query = gql`
    ${textQuery}
  `;
  const data = await airstack.request(query);
  console.log(data);
  return data;
}

async function contractsFinder(
  nftContracts: Record<string, Record<string, string>>,
  tokenContracts: Record<string, Record<string, string>>,
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
          tokenContracts[address][tokenBalance?.tokenAddress] =
            tokenBalance.token.name;
        } else {
          nftContracts[address][tokenBalance?.tokenAddress] =
            tokenBalance.token.name;
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
  const nftContracts: Record<string, Record<string, string>> = {};
  const tokenContracts: Record<string, Record<string, string>> = {};
  for (let i = 0; i < Math.ceil(addresses.length / limit); i++) {
    const skip = i * limit;
    await contractsFinder(
      nftContracts,
      tokenContracts,
      addresses.slice(skip, skip + limit),
      skip
    );
  }

  const commonNfts: Record<string, number> = {};
  const commonTokens: Record<string, number> = {};
  for (const candidate of candidates) {
    commonNfts[candidate] = 0;
  }
  for (const candidate of candidates) {
    commonNfts[candidate] = 0;
    commonTokens[candidate] = 0;
    for (const contractAddress in nftContracts[requester]) {
      commonNfts[candidate] += Number(
        Boolean(nftContracts[candidate][contractAddress])
      );
    }
    for (const contractAddress in tokenContracts[requester]) {
      commonTokens[candidate] += Number(
        Boolean(tokenContracts[candidate][contractAddress])
      );
    }
  }

  return { nftContracts, tokenContracts, commonNfts, commonTokens };
};

export default getOnchainScore;
