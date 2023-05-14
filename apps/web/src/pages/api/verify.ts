import type { NextApiRequest, NextApiResponse } from 'next';

export type Reply = {
  code: string;
};

import { ethers } from 'ethers';
import AttestationStationABI from '../../constants/abi.json';
import { AttestationStation } from 'src/typechain-types/AttestationStation';

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

// export async function signForDealCreation(data: {
//   orgId: string;
//   orgAdmin: string;
//   amount: string;
//   royaltyBasisPoints: string;
//   orgRoyaltyBasisPoints: string;
//   counterParty: string;
//   orgRoyaltyReceiver: string;
//   nftCID: string;
//   nonce: string;
// }) {
//   const types = {
//     CreateDeal: [
//       { name: "orgId", type: "uint256" },
//       { name: "orgAdmin", type: "address" },
//       { name: "amount", type: "uint256" },
//       { name: "royaltyBasisPoints", type: "uint96" },
//       { name: "orgRoyaltyBasisPoints", type: "uint96" },
//       { name: "counterParty", type: "address" },
//       { name: "orgRoyaltyReceiver", type: "address" },
//       { name: "nftCID", type: "string" },
//       { name: "nonce", type: "uint256" },
//     ],
//   };

//   return await signer._signTypedData(
//     await getDealContractDomain(),
//     types,
//     data
//   );
// }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reply>
) {
  const reqBody = {
    nullifier_hash: req.body.nullifier_hash,
    merkle_root: req.body.merkle_root,
    proof: req.body.proof,
    credential_type: req.body.credential_type,
    action: req.body.action,
    signal: req.body.signal
  };

  fetch(
    `https://developer.worldcoin.org/api/v1/verify/${process.env.NEXT_PUBLIC_WLD_APP_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    }
  ).then(async (verifyRes) => {
    const wldResponse = await verifyRes.json();
    if (verifyRes.status == 200) {
      res.status(200).send({ code: wldResponse.code });

      // This is where you should perform backend actions based on the verified credential, such as setting a user as "verified" in a database
      // TODO: update the verified status
      const key = 'world-id-verified';
      const formatedKey = ethers.encodeBytes32String(key);
      const tx = await attestrationContract['attest(address,bytes32,bytes)'](
        req.body.address,
        formatedKey,
        '0x01'
      );
      console.log(tx);
    } else {
      res.status(400).send({ code: wldResponse.code });
    }
  });
}
