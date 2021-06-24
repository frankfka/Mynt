import type { NextApiRequest, NextApiResponse } from 'next';
import { sidechainService } from '../../../../services';
import MyntSidechainAllUserTokensData from '../../../../services/sidechainService/types/MyntSidechainAllUserTokensData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyntSidechainAllUserTokensData>
) {
  res.status(200).json(await sidechainService.getAllUserTokens());
}
