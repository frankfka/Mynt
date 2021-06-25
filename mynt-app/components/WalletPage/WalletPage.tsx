import { Button, Col, Row } from 'antd';
import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import CreateTokenModal from './CreateTokenModal/CreateTokenModal';

require('./WalletPage.less');

function NoCreatedTokensPlaceholder() {
  return (
    <div className="center">
      <h2>No Created Tokens</h2>
      <p>
        It looks like you haven&apos;t created any tokens. Try creating one now
        - it takes less than a minute!
      </p>
    </div>
  );
}

function WalletPage() {
  const [isCreateTokenModalVisible, setCreateTokenModalVisible] =
    useState(false);

  const onCreateTokenClicked = () => {
    setCreateTokenModalVisible(true);
  };

  return (
    <div className="AppPage">
      <NavBar />
      {/*Create Token Modal*/}
      <CreateTokenModal
        isVisible={isCreateTokenModalVisible}
        setIsVisible={setCreateTokenModalVisible}
      />
      <div className="WalletPageContent">
        <h1>Your Wallet</h1>
        {/*Tokens Created by User*/}
        <div className="CreatedTokensContainer">
          {/*Top row with create button*/}
          <Row align="middle">
            <Col>
              <h2>Your Tokens</h2>
            </Col>
            <Col>
              <Button type="primary" onClick={onCreateTokenClicked}>
                Create a Token
              </Button>
            </Col>
          </Row>
          {/*Created tokens*/}
          <NoCreatedTokensPlaceholder />
        </div>

        {/*Tokens user holds (not created by user)*/}
        <div className="TokenBalancesContainer">
          <h2>Token Balances</h2>
        </div>
      </div>
    </div>
  );
}

export default WalletPage;
