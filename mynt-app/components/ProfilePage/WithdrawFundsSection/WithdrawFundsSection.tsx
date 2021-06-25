import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React from 'react';
import WithdrawalMethodRow from './WithdrawalMethodRow';

function WithdrawFundsSection() {
  return (
    <div className="WithdrawFundsSection">
      {/*Current Balance*/}
      <div className="CurrentBalanceContainer">
        <h2>Your Current Balance:</h2>
        <h1>$120.00</h1>
      </div>

      {/*Withdrawal Methods*/}
      <div className="WithdrawalMethodsContainer">
        <h2>Withdrawal Methods</h2>
        <Divider />
        <WithdrawalMethodRow />
        <Button
          type="primary"
          className="AddNewButton"
          icon={<PlusCircleOutlined />}
        >
          Add New
        </Button>
      </div>
    </div>
  );
}

export default WithdrawFundsSection;
