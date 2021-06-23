import { Express } from 'express';
import * as http from 'http';
import * as cors from 'cors';
import { BaseChannel, BasePlugin } from 'lisk-sdk';
import LiskUserToken from '../../modules/UserTokens/types/LiskUserToken';
import {
  GET_ALL_USER_TOKENS_ACTION_NAME,
  USER_TOKENS_MODULE_NAME,
} from '../../modules/UserTokens/util/constants';

import express = require('express'); // eslint-disable-line import/order

export class UserTokensApiPlugin extends BasePlugin {
  private _app!: Express;
  private _server!: http.Server;
  private _channel!: BaseChannel;

  public static get alias() {
    return 'UserTokensApi';
  }

  public static get info() {
    return {
      author: 'Frank Jia',
      version: '0.0.1',
      name: 'mynt-sidechain-user-tokens-api-plugin',
    };
  }

  public async load(channel: BaseChannel) {
    this._app = express() as Express;
    this._channel = channel;

    console.log(
      'UserTokensApiPlugin loaded with initial existing tokens',
      await this._channel.invoke<LiskUserToken[]>(
        `${USER_TOKENS_MODULE_NAME}:${GET_ALL_USER_TOKENS_ACTION_NAME}`
      )
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this._app.use(cors({ origin: '*', methods: ['GET'] }));
    this._app.use(express.json());

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this._app.get('/api/user-tokens', async (_, res) => {
      const allExistingTokens = await this._channel.invoke<LiskUserToken[]>(
        `${USER_TOKENS_MODULE_NAME}:${GET_ALL_USER_TOKENS_ACTION_NAME}`
      );

      res.json({
        userTokens: allExistingTokens,
      });
    });

    this._server = this._app.listen(4001);
  }

  public async unload(): Promise<void> {
    // Close server
    await new Promise<void>((resolve, reject) => {
      this._server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  public get defaults() {
    return {};
  }

  public get events() {
    return [];
  }

  public get actions() {
    return {};
  }
}
