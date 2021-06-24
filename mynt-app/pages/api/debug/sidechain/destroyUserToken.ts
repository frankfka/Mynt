import type { NextApiRequest, NextApiResponse } from 'next';
import { sidechainService } from '../../../../services';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(await sidechainService.destroyUserToken(req.body));
}
