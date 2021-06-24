import type { NextApiRequest, NextApiResponse } from 'next';
import { rapydService, sidechainService } from '../../../../services';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sourceWalletId, destinationWalletId, amount } = req.body;
  res
    .status(200)
    .json(
      await rapydService.transferWalletFunds(
        sourceWalletId,
        destinationWalletId,
        amount,
        'USD'
      )
    );
}
