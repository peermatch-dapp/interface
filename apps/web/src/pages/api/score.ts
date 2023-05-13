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
  const { commonNfts, commonTokens } = await getOnchainScore(
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
    { interests: number; nfts: number; tokens: number; userDetails: any }
  > = {};
  for (const address in commonInterests) {
    scores[address] = {
      interests: commonInterests[address],
      nfts: commonNfts[address],
      tokens: commonTokens[address],
      userDetails: users[address]
    };
  }

  return res.status(200).json({ scores });
}
