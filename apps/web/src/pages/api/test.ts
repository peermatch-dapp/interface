import type { NextApiRequest, NextApiResponse } from 'next';

export type Reply = {
  code: string;
};
import { AttestationStation } from '../../typechain-types/AttestationStation';

import { ethers } from 'ethers';
import AttestationStationABI from '../../constants/abi.json';

const provider = new ethers.JsonRpcProvider(
  'https://optimism-goerli.rpc.thirdweb.com'
);
const signer = new ethers.Wallet(
  process.env.SIGNER_PRIVATE_KEY || '',
  provider
);

const attestrationContract = new ethers.Contract(
  process.env.OPTIMISM_ATTESTRATION_CONTRACT || '',
  AttestationStationABI,
  signer
) as any as AttestationStation;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reply>
) {
  const key = 'world-id-verified';
  const formatedKey = ethers.encodeBytes32String(key);
  console.log(formatedKey);
  console.log(attestrationContract.attestations);
  console.log(Object.keys(attestrationContract));
  console.log(attestrationContract.interface);
  const tx = await attestrationContract['attest(address,bytes32,bytes)'](
    '0x6eA4Ea5c3cD5c1f77F9D2114659cBaCAeA97EdB7',
    formatedKey,
    '0x01'
  );
  console.log(tx);
  const attestation = await attestrationContract.attestations(
    '0x42032e50DDc86E91C71F94E7C1158E5b047419dF',
    '0x6eA4Ea5c3cD5c1f77F9D2114659cBaCAeA97EdB7',
    formatedKey
  );
  console.log(attestation);
  res.json({ attestation });
}
