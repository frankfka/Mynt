import { ALL_USER_TOKENS_KEY } from '../util/constants';
import LiskUserToken from './LiskUserToken';

export default interface AllUserTokensData {
  [ALL_USER_TOKENS_KEY]: LiskUserToken[];
}
