import type { NextApiRequest, NextApiResponse } from 'next';
import { sidechainService } from '../../../../../services';
import MyntSidechainAccountData from '../../../../../services/sidechainService/types/MyntSidechainAccountData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyntSidechainAccountData>
) {
  const { binaryAddress } = req.query;

  res
    .status(200)
    .json(await sidechainService.getAccountInfo(binaryAddress as string));
}
