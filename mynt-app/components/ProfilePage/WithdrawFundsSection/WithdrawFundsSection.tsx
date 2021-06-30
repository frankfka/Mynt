import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import RapydDebitCardBeneficiary from '../../../services/rapydService/types/RapydDebitCardBeneficiary';
import formatCurrency from '../../../util/formatCurrency';
import LoadingView from '../../LoadingView/LoadingView';
import WithdrawalMethodRow from './WithdrawalMethodRow';
import WithdrawFundsModal from './WithdrawFundsModal';

function WithdrawFundsSection() {
  const { userData, updateUserData } = useContext(UserContext);
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<RapydDebitCardBeneficiary>();

  if (userData == null) {
    return (
      <div style={{ display: 'flex', height: '100%' }}>
        <LoadingView />
      </div>
    );
  }

  const userBeneficiaries = Object.values(
    userData.dbData.rapyd.disburse.beneficiaries
  );
  const currentUserWalletBalance =
    userData.rapydData.wallet.accounts[0].balance; // Assume 1 USD account

  const showWithdrawModal = selectedBeneficiary != null;
  const onWithdrawModalDismiss = () => setSelectedBeneficiary(undefined);
  const onWithdrawSuccess = () => {
    updateUserData();
  };

  return (
    <div className="WithdrawFundsSection">
      {/*Withdraw Dialog*/}
      {selectedBeneficiary && (
        <WithdrawFundsModal
          isVisible={showWithdrawModal}
          setIsVisible={onWithdrawModalDismiss}
          availableBalance={currentUserWalletBalance}
          selectedBeneficiary={selectedBeneficiary}
          onWithdrawSuccess={onWithdrawSuccess}
          userRapydWalletId={userData.dbData.rapyd.eWalletId}
        />
      )}
      {/*Current Balance*/}
      <div className="CurrentBalanceContainer">
        <h2>Your Current Balance:</h2>
        <h1>{formatCurrency(currentUserWalletBalance)}</h1>
      </div>

      {/*Withdrawal Methods*/}
      <div className="WithdrawalMethodsContainer">
        <h2>Withdrawal Methods</h2>
        <Divider className="WithdrawalMethodsHeaderDivider" />
        {userBeneficiaries.map((beneficiary) => {
          return (
            <WithdrawalMethodRow
              key={beneficiary.id}
              onClick={() => setSelectedBeneficiary(beneficiary)}
              beneficiary={beneficiary}
            />
          );
        })}
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
