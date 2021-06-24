import type { NextApiRequest, NextApiResponse } from 'next';
import { rapydService, sidechainService } from '../../../../services';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { walletId } = req.query;

  res
    .status(200)
    .json(await rapydService.retrieveRapydWallet(walletId as string));
}
