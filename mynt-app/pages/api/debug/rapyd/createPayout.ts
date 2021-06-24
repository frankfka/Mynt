import type { NextApiRequest, NextApiResponse } from 'next';
import { rapydService } from '../../../../services';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await rapydService.createPayoutRequest(req.body));
}
