import { updateState } from '@lib/openai';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { state, message } = req.body;
  res.status(200).json(await updateState(state, message));
}
