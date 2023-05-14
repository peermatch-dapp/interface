import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { AttestationStation } from 'src/typechain-types/AttestationStation';

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
  res: NextApiResponse
) {
  const { address } = req.body;
  if (!ethers.isAddress(address)) {
    return res.status(400).json({ message: 'invalid ethereum address' });
  }
  const key = 'world-id-verified';
  const formatedKey = ethers.encodeBytes32String(key);
  const attestation = await attestrationContract.attestations(
    '0x42032e50DDc86E91C71F94E7C1158E5b047419dF',
    address,
    formatedKey
  );
  res.json({ status: attestation !== '0x' });
}
