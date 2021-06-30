import {
  Button,
  Col,
  Divider,
  Image,
  InputNumber,
  message,
  Modal,
  Radio,
  Result,
  Row,
  Space,
  Tag,
} from 'antd';
import React, { PropsWithoutRef, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import PurchaseUserTokenParams from '../../services/appService/types/PurchaseUserTokenParams';
import DatabaseTokenSale from '../../services/database/types/DatabaseTokenSale';
import User from '../../types/User';
import formatCurrency from '../../util/formatCurrency';
import formatNumber from '../../util/formatNumber';
import LoadingView from '../LoadingView/LoadingView';
import NavBar from '../NavBar/NavBar';

require('./TokenSalePage.less');

function TokenSalePage({ symbol }: PropsWithoutRef<{ symbol: string }>) {
  const [tokenSale, setTokenSale] = useState<DatabaseTokenSale>();
  const [tokenSaleHostUser, setTokenSaleHostUser] = useState<User>();
  const [loadError, setLoadError] = useState(false);

  // Purchase state
  const [numTokensToPurchase, setNumTokensToPurchase] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { userId, userData, updateUserData } = useContext(UserContext);

  // Get token sale and its parent user
  const fetchTokenSale = async () => {
    try {
      const tokenSaleResponse = await fetch(`/api/token-sale/${symbol}`);

      if (tokenSaleResponse.status !== 200) {
        throw Error(
          'Incorrect response status: ' + JSON.stringify(tokenSaleResponse)
        );
      }

      const tokenSaleResponseJson = await tokenSaleResponse.json();
      const tokenSaleObject = tokenSaleResponseJson as DatabaseTokenSale;

      setTokenSale(tokenSaleObject);

      const hostResponse = await fetch(
        `/api/user/${tokenSaleObject.parentUserId}`
      );

      if (hostResponse.status !== 200) {
        throw Error(
          'Incorrect response status: ' + JSON.stringify(hostResponse)
        );
      }

      const hostResponseJson = await hostResponse.json();

      setTokenSaleHostUser(hostResponseJson as User);
    } catch (err) {
      console.error('Error fetching token sale data', err);
      setLoadError(true);
    }
  };

  // Fetch on load
  useEffect(() => {
    fetchTokenSale();
  }, []);

  if (tokenSale == null || tokenSaleHostUser == null || userData == null) {
    return (
      <div className="AppPage">
        <NavBar />
        <div style={{ height: '70vh', display: 'flex' }}>
          {loadError ? (
            <Result
              status="error"
              title="Not Found"
              subTitle={`Token sale for ${symbol} was not found.`}
            />
          ) : (
            <LoadingView />
          )}
        </div>
      </div>
    );
  }

  // Whether the token sale is hosted by the current user
  const isHostedByUser = tokenSale.parentUserId === userId;
  const totalCostAmount = numTokensToPurchase * tokenSale.unitCost.amount;
  const isRapydPayment = selectedPaymentId?.startsWith('ewallet');
  const hasEnoughFunds = isRapydPayment
    ? userData.rapydData.wallet.accounts[0].balance >= totalCostAmount
    : true;

  const processPurchase = async () => {
    if (selectedPaymentId == null || !hasEnoughFunds) {
      return;
    }
    setIsProcessingPayment(true);

    const purchaseParams: PurchaseUserTokenParams = {
      buyerUserId: userId,
      symbol: tokenSale.symbol,
      amount: numTokensToPurchase,
      paymentMethod: {
        id: selectedPaymentId,
        category: isRapydPayment ? 'ewallet' : 'card',
      },
    };

    try {
      const purchaseResponse = await fetch('/api/purchase-user-token', {
        method: 'POST',
        body: JSON.stringify(purchaseParams),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (purchaseResponse.status !== 200) {
        throw Error(
          'Invalid response code ' + JSON.stringify(purchaseResponse)
        );
      }

      const purchaseResponseJson = await purchaseResponse.json();

      Modal.success({
        title: 'Purchase Success',
        content: (
          <div>
            <p className="m0">
              Your purchase of {numTokensToPurchase} {tokenSale.symbol} was
              successful!
            </p>
            <small>{purchaseResponseJson.paymentId}</small>
          </div>
        ),
        maskClosable: true,
      });
    } catch (err) {
      message.error('Something went wrong. Please try again.');
      console.error('Error purchasing token', err);
    } finally {
      setIsProcessingPayment(false);
      // Update data
      fetchTokenSale();
      updateUserData();
    }
  };

  // Payment section
  const renderPaymentSection = (): React.ReactElement | null => {
    if (isHostedByUser) {
      return null;
    }

    return (
      <div className="PaymentSection">
        <h3>Purchase {tokenSale.symbol}</h3>
        <Space direction="vertical">
          {/*Payment method radios*/}
          <div>
            <Radio.Group
              value={selectedPaymentId}
              onChange={(e) => setSelectedPaymentId(e.target.value)}
              disabled={isProcessingPayment}
            >
              <Space>
                {/*Rapyd Payment*/}
                <Radio.Button value={userData.dbData.rapyd.eWalletId}>
                  <Space>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://www.rapyd.net/wp-content/uploads/2019/09/rapyd-logo-png.png"
                      className="PaymentMethodImage"
                      alt="Payment method image"
                    />
                    <span>
                      eWallet (
                      {formatCurrency(
                        userData.rapydData.wallet.accounts[0].balance
                      )}
                      &nbsp;USD)
                    </span>
                  </Space>
                </Radio.Button>
                {/*Card payment methods*/}
                {userData.dbData.rapyd.collect.paymentMethods.map(
                  (paymentMethod) => {
                    return (
                      <Radio.Button
                        key={paymentMethod.id}
                        value={paymentMethod.id}
                      >
                        <Space>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={paymentMethod.image}
                            className="PaymentMethodImage"
                            alt="Payment method image"
                          />
                          <span>Ending in: {paymentMethod.last4}</span>
                        </Space>
                      </Radio.Button>
                    );
                  }
                )}
              </Space>
            </Radio.Group>
          </div>
          {/*Quantity*/}
          <Space direction="horizontal">
            <span>Quantity: </span>
            <InputNumber
              min={1}
              max={tokenSale.availableQuantity}
              precision={0}
              value={numTokensToPurchase}
              onChange={setNumTokensToPurchase}
              disabled={isProcessingPayment}
            />
          </Space>
          {/*Purchase button*/}
          <Button
            type="primary"
            disabled={
              isProcessingPayment ||
              totalCostAmount === 0 ||
              !hasEnoughFunds ||
              selectedPaymentId == null
            }
            loading={isProcessingPayment}
            onClick={processPurchase}
          >
            Purchase Now{' '}
            {totalCostAmount > 0 && `| ${formatCurrency(totalCostAmount)} USD`}
          </Button>
        </Space>
      </div>
    );
  };

  // Main content
  return (
    <div className="AppPage">
      <NavBar />
      {/*Main Page Content*/}
      <div className="TokenSalePageContent">
        <div className="TokenSaleInfoContainer">
          <Row justify="space-between">
            {/*Sale details + purchase*/}
            <Col className="TokenSaleDetailsContainer">
              <h1 className="m0">
                {tokenSale.symbol} - {formatCurrency(tokenSale.unitCost.amount)}{' '}
                USD
              </h1>
              <Space split={<Divider type="vertical" />}>
                <h4 className="m0">
                  Available Tokens: {formatNumber(tokenSale.availableQuantity)}
                </h4>
                {isHostedByUser && (
                  <>
                    <Tag className="UserHostedTag">Hosted By You</Tag>
                    <Button type="link" style={{ padding: 0 }}>
                      Edit Token Sale
                    </Button>
                  </>
                )}
              </Space>
              {tokenSale.description && (
                <div className="DescriptionSection">
                  <h3>Details</h3>
                  <p>{tokenSale.description}</p>
                </div>
              )}
              {renderPaymentSection()}
            </Col>
            {/*Owner Profile*/}
            <Col className="TokenSaleHostUserContainer">
              <Image
                src={tokenSaleHostUser.dbData.profileImage}
                className="HostUserProfileImage"
              />
              <h3>Hosted by: {tokenSaleHostUser.dbData.name}</h3>
              {tokenSaleHostUser.dbData.profileDescription && (
                <div>
                  <h4>User Profile</h4>
                  <p>{tokenSaleHostUser.dbData.profileDescription}</p>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default TokenSalePage;
