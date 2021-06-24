import type { NextApiRequest, NextApiResponse } from 'next';
import appService, { sidechainService } from '../../../services';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  res.status(200).json(await appService.getUser(userId as string));
}
