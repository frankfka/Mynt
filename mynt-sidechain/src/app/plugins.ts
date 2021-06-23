import { Application, HTTPAPIPlugin } from 'lisk-sdk';
import { UserTokensApiPlugin } from './plugins/UserTokensApi/UserTokensApiPlugin';

export const registerPlugins = (app: Application): void => {
  app.registerPlugin(UserTokensApiPlugin);
  app.registerPlugin(HTTPAPIPlugin);
};
