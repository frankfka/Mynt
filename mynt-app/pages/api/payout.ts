import type { NextApiRequest, NextApiResponse } from 'next';
import appService from '../../services';

// POST only
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await appService.createPayoutRequest(req.body));
}
