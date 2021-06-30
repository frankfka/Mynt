import { PlusCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space, Tag } from 'antd';
import React from 'react';
import formatNumber from '../../../util/formatNumber';

require('./TokenBalanceRow.less');

type TokenBalanceRowProps = {
  symbol: string;
  name: string;
  availableSupply: number;
  currentBalance: number;
  createdByUser?: boolean;
  createTokenSaleAction?(): void;
  createTokenRedemptionAction?(): void;
  viewTokenSaleAction?(): void;
  viewTokenRedemptionsAction?(): void;
};

const TokenBalanceRow: React.FC<TokenBalanceRowProps> = ({
  symbol,
  availableSupply,
  currentBalance,
  createdByUser,
  createTokenSaleAction,
  createTokenRedemptionAction,
  viewTokenSaleAction,
  viewTokenRedemptionsAction,
  name,
}: TokenBalanceRowProps) => {
  return (
    <Row className="TokenBalanceRow" align="middle">
      <Col flex="auto">
        <Space>
          <h3 className="m0">{symbol}</h3>
          {createdByUser && (
            <Tag className="UserCreatedTag">Created By You</Tag>
          )}
        </Space>
        <p className="TokenDetailsText">
          {name} | Available Supply: {formatNumber(availableSupply)}
        </p>
      </Col>
      {/*Current Balance*/}
      <Col className="BalanceActionsCol">
        <div>
          <Space>
            <h3 className="m0">
              Balance: {formatNumber(currentBalance)} {symbol}
            </h3>
            <Divider type="vertical" />
            <Button shape="circle" icon={<SwapOutlined />} />
          </Space>
        </div>
        {createdByUser && (
          <div className="CreateSaleRedemptionButtonContainer">
            <Space split={<Divider type="vertical" className="m0" />}>
              {/*Create actions*/}
              <Button
                type="link"
                icon={<PlusCircleOutlined />}
                disabled={createTokenSaleAction == null}
                onClick={createTokenSaleAction}
              >
                Sale
              </Button>
              <Button
                type="link"
                icon={<PlusCircleOutlined />}
                onClick={createTokenRedemptionAction}
              >
                Redemption
              </Button>
              {/*View Actions*/}
              <Button
                type="link"
                disabled={viewTokenSaleAction == null}
                onClick={viewTokenSaleAction}
              >
                View Token Sale
              </Button>
              <Button
                type="link"
                disabled={viewTokenRedemptionsAction == null}
                onClick={viewTokenRedemptionsAction}
              >
                View Redemptions
              </Button>
            </Space>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default TokenBalanceRow;
