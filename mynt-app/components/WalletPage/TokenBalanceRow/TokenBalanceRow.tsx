import { PlusCircleOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space, Tag } from 'antd';
import React from 'react';

require('./TokenBalanceRow.less');

/*
Given:
- Symbol
- Name
- Circulating supply
- balance
 */

type TokenBalanceRowProps = {
  symbol: string;
  name: string;
  availableSupply: number;
  currentBalance: number;
  createdByUser?: boolean;
  createTokenSaleAction?(): void;
  createTokenRedemptionAction?(): void;
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
const TokenBalanceRow: React.FC<TokenBalanceRowProps> = ({
  symbol,
  availableSupply,
  currentBalance,
  createdByUser,
  createTokenSaleAction,
  createTokenRedemptionAction,
  name,
}: TokenBalanceRowProps) => {
  return (
    <Row className="TokenBalanceRow" align="middle">
      <Col flex="auto">
        <Space>
          <h3>{symbol}</h3>
          {createdByUser && (
            <Tag className="UserCreatedTag">Created By You</Tag>
          )}
        </Space>
        <p>
          {name} | Available Supply: {availableSupply}
        </p>
      </Col>
      {/*Current Balance*/}
      <Col className="BalanceActionsCol">
        <div>
          <Space>
            <h3>
              Balance: {currentBalance} {symbol}
            </h3>
            <Divider type="vertical" />
            <Button shape="circle" icon={<SwapOutlined />} />
          </Space>
        </div>
        {createdByUser && (
          <div className="CreateSaleRedemptionButtonContainer">
            <Space split={<Divider type="vertical" />}>
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
            </Space>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default TokenBalanceRow;
