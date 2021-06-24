import type { NextApiRequest, NextApiResponse } from 'next';
import { sidechainService } from '../../../../services';
import MyntSidechainNodeData from '../../../../services/sidechainService/types/MyntSidechainNodeData';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MyntSidechainNodeData>
) {
  res.status(200).json(await sidechainService.getNodeInfo());
}
