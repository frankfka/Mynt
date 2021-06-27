import type { NextApiRequest, NextApiResponse } from 'next';
import appService from '../../../services';

// POST for creating user token | GET for getting all user tokens
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    res.status(200).json(await appService.createUserToken(req.body));
  } else {
    res.status(200).json(await appService.getAllUserTokens());
  }
}
