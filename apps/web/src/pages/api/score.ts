/* eslint-disable no-console */
import getInterests from '@lib/getInterests';
import getOnchainScore from '@lib/getOnchainScore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { address, profile } = req.query;
  const requesterId: any =
    address || '0xBD19a3F0A9CaCE18513A1e2863d648D13975CB30';
  const profileId = profile || '0x0e29';
  const interests = await getInterests(profileId);
  const {
    nftContracts,
    tokenContracts,
    totalCommonNfts,
    totalCommonTokens,
    commonNfts,
    commonTokens
  } = await getOnchainScore(
    requesterId,
    interests.map((interest) => interest.address)
  );

  const commonInterests: Record<string, number> = {};
  const users: any = {};
  for (const i of interests) {
    users[i.address] = i;
  }
  // eslint-disable-next-line unicorn/no-array-for-each
  interests.forEach((interests) => {
    commonInterests[interests.address] = interests.numberInCommon;
  });

  const scores: Record<
    string,
    {
      interests: number;
      commonNft: Record<string, { name: string; logo: string }>;
      commonToken: Record<string, { name: string; logo: string }>;
      userDetails: any;
      nftContract: Record<string, { name: string; logo: string }>;
      tokenContract: Record<string, { name: string; logo: string }>;
      totalCommonNft: number;
      totalCommonToken: number;
      totalScore: number;
    }
  > = {};

  for (const address in commonInterests) {
    scores[address] = {
      interests: commonInterests[address],
      commonNft: commonNfts[address],
      commonToken: commonTokens[address],
      userDetails: users[address],
      nftContract: nftContracts[address],
      tokenContract: tokenContracts[address],
      totalCommonNft: totalCommonNfts[address],
      totalCommonToken: totalCommonTokens[address],
      totalScore:
        commonInterests[address] +
        totalCommonNfts[address] +
        totalCommonTokens[address]
    };
  }

  const scoresArray: {
    address: string;
    interests: number;
    commonNft: Record<string, { name: string; logo: string }>;
    commonToken: Record<string, { name: string; logo: string }>;
    userDetails: any;
    nftContract: Record<string, { name: string; logo: string }>;
    tokenContract: Record<string, { name: string; logo: string }>;
    totalCommonNft: number;
    totalCommonToken: number;
    totalScore: number;
  }[] = [];

  for (const address in scores) {
    scoresArray.push({ address, ...scores[address] });
  }

  scoresArray.sort((a, b) => b.totalScore - a.totalScore);

  return res.status(200).json({ scores: scoresArray });
}
