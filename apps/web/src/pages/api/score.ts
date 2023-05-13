/* eslint-disable no-console */
import getInterests from '@lib/getInterests';
import getOnchainScore from '@lib/getOnchainScore';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const requesterId = '0xBD19a3F0A9CaCE18513A1e2863d648D13975CB30';
  const interests = await getInterests();
  const { commonNfts, commonTokens } = await getOnchainScore(
    requesterId,
    interests.map((interest) => interest.address)
  );

  const commonInterests: Record<string, number> = {};
  // eslint-disable-next-line unicorn/no-array-for-each
  interests.forEach(
    (interests) =>
      (commonInterests[interests.address] = interests.numberInCommon)
  );

  const scores: Record<
    string,
    { interests: number; nfts: number; tokens: number }
  > = {};
  for (const address in commonInterests) {
    scores[address] = {
      interests: commonInterests[address],
      nfts: commonNfts[address],
      tokens: commonTokens[address]
    };
  }

  res.json({ scores });
  return res.status(200).json({ interests });
}
