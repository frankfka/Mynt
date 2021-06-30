import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, message, Row, Space } from 'antd';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import LiskUserToken from '../../../mynt-sidechain/src/app/modules/UserTokens/types/LiskUserToken';
import { UserContext } from '../../context/UserContext';
import LoadingView from '../LoadingView/LoadingView';
import NavBar from '../NavBar/NavBar';
import CreateTokenModal from './CreateTokenModal/CreateTokenModal';
import CreateTokenRedemptionModal from './CreateTokenRedemptionModal/CreateTokenRedemptionModal';
import CreateTokenSaleModal from './CreateTokenSaleModal/CreateTokenSaleModal';
import TokenBalanceRow from './TokenBalanceRow/TokenBalanceRow';
import UserTokenWalletData from './types/UserTokenWalletData';

require('./WalletPage.less');

function NoTokensPlaceholder() {
  return (
    <div className="center NoTokensPlaceholderContainer">
      <div className="NoTokensPlaceholderTextContainer">
        <h2>It looks like you don&apos;t have any tokens.</h2>
        <p>
          You can purchase tokens that someone else has created through their
          token sales. You can also try creating your own token - it takes less
          than a minute!
        </p>
      </div>
    </div>
  );
}

function WalletPage() {
  const router = useRouter();
  const { userData, updateUserData } = useContext(UserContext);

  const [allUserTokens, setAllUserTokens] = useState<LiskUserToken[]>();

  // Modals
  const [isCreateTokenModalVisible, setCreateTokenModalVisible] =
    useState(false);
  const [createTokenSaleForToken, setCreateTokenSaleForToken] =
    useState<UserTokenWalletData>();
  const [createTokenRedemptionForToken, setCreateTokenRedemptionForToken] =
    useState<UserTokenWalletData>();
  const [fetchTokenError, setFetchTokenError] = useState(false);

  const fetchAllUserTokens = async () => {
    try {
      const response = await fetch('/api/user-token');
      const responseJson = await response.json();
      console.debug('Fetched all user tokens', responseJson);

      setAllUserTokens(responseJson['userTokens'] as LiskUserToken[]);
    } catch (err) {
      message.error('Something went wrong. Please try again.');
      console.error('Error fetching user tokens', err);
      setFetchTokenError(true);
    }
  };

  const reloadData = (withTimeout: boolean = false) => {
    // Set timeout to refetch data after block time, if needed
    setTimeout(
      () => {
        fetchAllUserTokens();
        updateUserData();
      },
      withTimeout ? 12 * 1000 : 0
    );
  };

  // Fetch data on screen load
  useEffect(() => {
    fetchAllUserTokens();
    updateUserData();
  }, []);

  const onCreateTokenClicked = () => {
    setCreateTokenModalVisible(true);
  };

  const onCreateTokenSaleClicked = (tokenData: UserTokenWalletData) => {
    setCreateTokenSaleForToken(tokenData);
  };

  const onCreateTokenRedemptionClicked = (tokenData: UserTokenWalletData) => {
    setCreateTokenRedemptionForToken(tokenData);
  };

  if (userData == null || allUserTokens == null) {
    return (
      <div className="AppPage">
        <NavBar />
        <div style={{ display: 'flex', minHeight: '70vh' }}>
          {fetchTokenError ? null : <LoadingView />}
        </div>
      </div>
    );
  }

  const userTokens: UserTokenWalletData[] = [];

  // Create data for rendering balances
  sortBy(userData.sidechainData.userTokenBalances, 'symbol').forEach(
    (tokenBalance) => {
      const userTokenData = allUserTokens.find(
        (token) => token.symbol === tokenBalance.symbol
      );
      if (userTokenData) {
        // Data to hold for rendering
        const walletTokenData: UserTokenWalletData = {
          ...userTokenData,
          ...tokenBalance,
          createdByUser: !!userData.sidechainData.createdUserTokenSymbols.find(
            (s) => s === tokenBalance.symbol
          ),
          hasTokenSale: !!userData.dbData.activeTokenSales.find(
            (s) => s === tokenBalance.symbol
          ),
          hasTokenRedemptions:
            Object.keys(userData.dbData.activeTokenRedemptions).length > 0,
        };

        userTokens.push(walletTokenData);
      } else {
        console.warn(`User token symbol ${tokenBalance.symbol} not found`);
      }
    }
  );

  const renderUserTokensContent = () => {
    if (userTokens.length > 0) {
      return (
        <>
          {userTokens.map((token) => {
            return (
              <TokenBalanceRow
                key={token.symbol}
                availableSupply={token.circulatingSupply}
                symbol={token.symbol}
                currentBalance={token.balance}
                name={token.name}
                createdByUser={token.createdByUser}
                createTokenSaleAction={
                  token.createdByUser && !token.hasTokenSale
                    ? () => onCreateTokenSaleClicked(token)
                    : undefined
                }
                createTokenRedemptionAction={
                  token.createdByUser
                    ? () => onCreateTokenRedemptionClicked(token)
                    : undefined
                }
                viewTokenSaleAction={
                  token.createdByUser && token.hasTokenSale
                    ? () => router.push(`/token-sale/${token.symbol}`)
                    : undefined
                }
                viewTokenRedemptionsAction={
                  token.createdByUser && token.hasTokenRedemptions
                    ? () => {}
                    : undefined
                }
              />
            );
          })}
        </>
      );
    } else {
      return <NoTokensPlaceholder />;
    }
  };

  return (
    <div className="AppPage">
      <NavBar />
      {/*Token Sale Modal*/}
      {createTokenSaleForToken && (
        <CreateTokenSaleModal
          userToken={createTokenSaleForToken}
          isVisible={!!createTokenSaleForToken}
          setIsVisible={(newVal) => {
            if (!newVal) {
              setCreateTokenSaleForToken(undefined);
            }
          }}
          onCreateTokenSaleSuccess={() => reloadData()}
        />
      )}
      {/*Token Sale Modal*/}
      {createTokenRedemptionForToken && (
        <CreateTokenRedemptionModal
          userToken={createTokenRedemptionForToken}
          isVisible={!!createTokenRedemptionForToken}
          setIsVisible={(newVal) => {
            if (!newVal) {
              setCreateTokenRedemptionForToken(undefined);
            }
          }}
          onCreateTokenRedemptionSuccess={() => reloadData()}
        />
      )}
      {/*Create Token Modal*/}
      <CreateTokenModal
        isVisible={isCreateTokenModalVisible}
        setIsVisible={setCreateTokenModalVisible}
        onCreateTokenSuccess={() => reloadData(true)}
      />
      <div className="WalletPageContent">
        {/*Top row with create button*/}
        <Space className="WalletPageHeader">
          <h1 className="m0">Your Wallet</h1>
          <Button
            shape="circle"
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateTokenClicked}
          />
        </Space>
        {/*Token Balances*/}
        <div className="TokenBalanceRowsContainer">
          {renderUserTokensContent()}
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
