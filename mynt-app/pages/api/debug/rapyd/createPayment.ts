import type { NextApiRequest, NextApiResponse } from 'next';
import { rapydService, sidechainService } from '../../../../services';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { paymentMethodId, destinationWalletId, amount } = req.body;
  res
    .status(200)
    .json(
      await rapydService.createPayment(
        paymentMethodId,
        destinationWalletId,
        amount,
        'USD'
      )
    );
}
