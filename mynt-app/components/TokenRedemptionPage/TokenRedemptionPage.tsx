import {
  Button,
  Col,
  Divider,
  Image,
  InputNumber,
  message,
  Modal,
  Result,
  Row,
  Space,
  Tag,
} from 'antd';
import React, { PropsWithoutRef, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import RedeemUserTokenParams from '../../services/appService/types/RedeemUserTokenParams';
import DatabaseTokenRedemption from '../../services/database/types/DatabaseTokenRedemption';
import User from '../../types/User';
import formatNumber from '../../util/formatNumber';
import LoadingView from '../LoadingView/LoadingView';
import NavBar from '../NavBar/NavBar';

require('./TokenRedemptionPage.less');

function TokenRedemptionPage({
  redemptionId,
}: PropsWithoutRef<{ redemptionId: string }>) {
  const [tokenRedemption, setTokenRedemption] =
    useState<DatabaseTokenRedemption>();
  const [tokenRedemptionHostUser, setTokenRedemptionHostUser] =
    useState<User>();
  const [loadError, setLoadError] = useState(false);

  // Purchase state
  const [qtyToRedeem, setQtyToRedeem] = useState(1);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const { userId, userData, updateUserData } = useContext(UserContext);

  // Get token redemption and its parent user
  const fetchTokenRedemption = async () => {
    try {
      const tokenRedemptionResponse = await fetch(
        `/api/token-redemption/${redemptionId}`
      );

      if (tokenRedemptionResponse.status !== 200) {
        throw Error(
          'Incorrect response status: ' +
            JSON.stringify(tokenRedemptionResponse)
        );
      }

      const tokenRedemptionResponseJson = await tokenRedemptionResponse.json();
      const tokenRedemptionObject =
        tokenRedemptionResponseJson as DatabaseTokenRedemption;

      setTokenRedemption(tokenRedemptionObject);

      const hostResponse = await fetch(
        `/api/user/${tokenRedemptionObject.parentUserId}`
      );

      if (hostResponse.status !== 200) {
        throw Error(
          'Incorrect response status: ' + JSON.stringify(hostResponse)
        );
      }

      const hostResponseJson = await hostResponse.json();

      setTokenRedemptionHostUser(hostResponseJson as User);
    } catch (err) {
      console.error('Error fetching token redemption data', err);
      setLoadError(true);
    }
  };

  // Fetch on load
  useEffect(() => {
    fetchTokenRedemption();
  }, []);

  if (
    tokenRedemption == null ||
    tokenRedemptionHostUser == null ||
    userData == null
  ) {
    return (
      <div className="AppPage">
        <NavBar />
        <div style={{ height: '70vh', display: 'flex' }}>
          {loadError ? (
            <Result
              status="error"
              title="Not Found"
              subTitle="This token redemption was not found"
              style={{
                margin: 'auto',
              }}
            />
          ) : (
            <LoadingView />
          )}
        </div>
      </div>
    );
  }

  const isHostedByUser = tokenRedemption.parentUserId === userId;
  const userTokenBalance: number =
    userData.sidechainData.userTokenBalances.find(
      (tokenBalance) => tokenBalance.symbol === tokenRedemption.symbol
    )?.balance ?? 0;
  const costInTokens = qtyToRedeem * tokenRedemption.unitCost;
  const hasEnoughFunds = userTokenBalance > costInTokens;

  const processRedemption = async () => {
    if (!hasEnoughFunds) {
      return;
    }
    setIsRedeeming(true);

    const redeemUserTokenParams: RedeemUserTokenParams = {
      userId,
      redemptionId,
      quantity: qtyToRedeem,
    };

    try {
      const redeemResponse = await fetch('/api/redeem-user-token', {
        method: 'POST',
        body: JSON.stringify(redeemUserTokenParams),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (redeemResponse.status !== 200) {
        throw Error('Invalid response code ' + JSON.stringify(redeemResponse));
      }

      Modal.success({
        title: 'Redemption Success',
        content: (
          <div>
            <p className="m0">
              Your redemption of {qtyToRedeem} {tokenRedemption.symbol} for
              &rdquo;{tokenRedemption.title}&rdquo; was successful! The host
              will reach out with further instructions. Your wallet balance will
              update soon.
            </p>
          </div>
        ),
        maskClosable: true,
      });
    } catch (err) {
      message.error('Something went wrong. Please try again.');
      console.error('Error redeeming', err);
    } finally {
      setIsRedeeming(false);
      // Update data
      fetchTokenRedemption();
      // After block time
      setTimeout(() => {
        updateUserData();
      }, 12 * 1000);
    }
  };

  // Payment section
  const renderPaymentSection = (): React.ReactElement | null => {
    if (isHostedByUser) {
      return null;
    }

    return (
      <div className="PaymentSection">
        <h3>Redeem {tokenRedemption.symbol}</h3>
        <Space direction="vertical">
          {/*Quantity*/}
          <Space direction="horizontal">
            <span>Quantity: </span>
            <InputNumber
              min={1}
              max={tokenRedemption.availableQuantity}
              precision={0}
              value={qtyToRedeem}
              onChange={setQtyToRedeem}
              disabled={isRedeeming}
            />
          </Space>
          {/*Purchase button*/}
          <Button
            type="primary"
            disabled={isRedeeming || costInTokens === 0 || !hasEnoughFunds}
            loading={isRedeeming}
            onClick={processRedemption}
          >
            Redeem Now{' '}
            {costInTokens > 0 &&
              `| ${formatNumber(costInTokens)} ${tokenRedemption.symbol}`}
          </Button>
          {/*Current Funds*/}
          <p style={{ fontStyle: 'italic' }}>
            You currently have {formatNumber(userTokenBalance)}{' '}
            {tokenRedemption.symbol}.
          </p>
        </Space>
      </div>
    );
  };

  // Main content
  return (
    <div className="AppPage">
      <NavBar />
      {/*Main Page Content*/}
      <div className="TokenRedemptionPageContent">
        <div className="TokenRedemptionInfoContainer">
          <Row justify="space-between">
            {/*Sale details + purchase*/}
            <Col className="TokenRedemptionDetailsContainer">
              <h1 className="m0">{tokenRedemption.title}</h1>
              <Space split={<Divider type="vertical" />}>
                <h4 className="m0">
                  {formatNumber(tokenRedemption.unitCost)}{' '}
                  {tokenRedemption.symbol} per redemption
                </h4>
                <h4 className="m0">
                  Available Quantity:{' '}
                  {formatNumber(tokenRedemption.availableQuantity)}
                </h4>
                {isHostedByUser && (
                  <>
                    <Tag className="UserHostedTag">Hosted By You</Tag>
                    <Button type="link" style={{ padding: 0 }}>
                      Edit Token Redemption
                    </Button>
                  </>
                )}
              </Space>
              {tokenRedemption.description && (
                <div className="DescriptionSection">
                  <h3>Details</h3>
                  <p>{tokenRedemption.description}</p>
                </div>
              )}
              {renderPaymentSection()}
            </Col>
            {/*Owner Profile*/}
            <Col className="TokenRedemptionHostUserContainer">
              <Image
                src={tokenRedemptionHostUser.dbData.profileImage}
                className="HostUserProfileImage"
              />
              <h3>Hosted by: {tokenRedemptionHostUser.dbData.name}</h3>
              {tokenRedemptionHostUser.dbData.profileDescription && (
                <div>
                  <h4>User Profile</h4>
                  <p>{tokenRedemptionHostUser.dbData.profileDescription}</p>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default TokenRedemptionPage;
