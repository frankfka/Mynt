import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { sortBy } from 'lodash';
import LiskUserToken from '../../../mynt-sidechain/src/app/modules/UserTokens/types/LiskUserToken';
import UserTokenBalance from '../../../mynt-sidechain/src/app/modules/UserTokens/types/UserTokenBalance';
import { UserContext } from '../../context/UserContext';
import NavBar from '../NavBar/NavBar';
import CreateTokenModal from './CreateTokenModal/CreateTokenModal';
import TokenBalanceRow from './TokenBalanceRow/TokenBalanceRow';

require('./WalletPage.less');

function NoTokensPlaceholder() {
  return (
    <div className="center">
      <h2>No Tokens</h2>
      <p>
        It looks like you don&apos;t have any tokens. You can purchase tokens
        that someone else has created through their token sales. You can also
        try creating your own token - it takes less than a minute!
      </p>
    </div>
  );
}

type UserTokenWalletData = LiskUserToken &
  UserTokenBalance & {
    createdByUser: boolean;
    hasTokenSale: boolean;
  };

function WalletPage() {
  const { userData, updateUserData } = useContext(UserContext);

  const [allUserTokens, setAllUserTokens] = useState<LiskUserToken[]>([]);
  const [isCreateTokenModalVisible, setCreateTokenModalVisible] =
    useState(false);

  const fetchAllUserTokens = async () => {
    try {
      const response = await fetch('/api/user-token');
      const responseJson = await response.json();
      console.debug('Fetched all user tokens', responseJson);

      setAllUserTokens(responseJson['userTokens'] as LiskUserToken[]);
    } catch (err) {
      console.error('Error fetching user tokens', err);
    }
  };

  // Fetch data on screen load
  useEffect(() => {
    fetchAllUserTokens();
    updateUserData();
  }, []);

  const onCreateTokenClicked = () => {
    setCreateTokenModalVisible(true);
  };

  const onCreateTokenSuccess = () => {
    // Set timeout to refetch data after block time
    setTimeout(() => {
      fetchAllUserTokens();
      updateUserData();
    }, 12 * 1000);
  };

  const onCreateTokenSaleClicked = (tokenData: UserTokenWalletData) => {};

  const onCreateTokenRedemptionClicked = (tokenData: UserTokenWalletData) => {};

  if (userData == null) {
    return null;
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
      {/*Create Token Modal*/}
      <CreateTokenModal
        isVisible={isCreateTokenModalVisible}
        setIsVisible={setCreateTokenModalVisible}
        onCreateTokenSuccess={onCreateTokenSuccess}
      />
      <div className="WalletPageContent">
        {/*Top row with create button*/}
        <Row align="middle">
          <Col>
            <h1 className="m0">Your Wallet</h1>
          </Col>
          <Col>
            <Button
              shape="circle"
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateTokenClicked}
            />
          </Col>
        </Row>
        {/*Token Balances*/}
        <div className="TokenBalanceRowsContainer">
          {renderUserTokensContent()}
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
