import type { NextApiRequest, NextApiResponse } from 'next';
import appService from '../../../services';

// POST for creating a token redemption
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await appService.createUserTokenRedemption(req.body));
}
