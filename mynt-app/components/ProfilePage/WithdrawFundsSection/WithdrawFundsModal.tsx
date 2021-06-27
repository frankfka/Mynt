import {
  Modal,
  InputNumber,
  Space,
  Select,
  message,
  Button,
  Result,
} from 'antd';
import { get } from 'lodash';
import React, { useState } from 'react';
import CreatePayoutRequestParams from '../../../services/appService/types/CreatePayoutRequestParams';
import RapydDebitCardBeneficiary from '../../../services/rapydService/types/RapydDebitCardBeneficiary';
import formatCurrency from '../../../util/formatCurrency';

const { Option } = Select;

type Props = {
  isVisible: boolean;
  setIsVisible(newVal: boolean): void;
  availableBalance: number;
  selectedBeneficiary: RapydDebitCardBeneficiary;
  userRapydWalletId: string;
  onWithdrawSuccess(): void;
};
const WithdrawFundsModal: React.FC<Props> = ({
  isVisible,
  setIsVisible,
  availableBalance,
  selectedBeneficiary,
  userRapydWalletId,
  onWithdrawSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [withdrawConfirmationId, setWithdrawConfirmationId] =
    useState<string>();

  const onWithdrawButtonClicked = async () => {
    if (selectedAmount < 0.01) {
      message.error('Please specify a valid amount to withdraw.');
      return;
    }

    setIsProcessingWithdrawal(true);

    const payoutRequestParams: CreatePayoutRequestParams = {
      cost: {
        amount: selectedAmount,
        currency: 'USD',
      },
      beneficiaryId: selectedBeneficiary.id,
      ewalletId: userRapydWalletId,
    };

    try {
      const response = await fetch('/api/payout', {
        method: 'POST',
        body: JSON.stringify(payoutRequestParams),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseJson = await response.json();

      const payoutId = get(responseJson, 'data.id');

      if (payoutId) {
        setWithdrawConfirmationId(payoutId);
        onWithdrawSuccess();
      } else {
        throw Error(
          'No payout ID from response: ' + JSON.stringify(responseJson)
        );
      }
    } catch (err) {
      console.error('Error withdrawing funds', err);
    } finally {
      setIsProcessingWithdrawal(false);
    }
  };

  /**
   * Success message
   */
  const renderSuccessContent = () => {
    return (
      <div className="WithdrawFundsSuccessModalContent">
        <Result
          status="success"
          title="Success!"
          subTitle={`Your withdrawal of ${formatCurrency(
            selectedAmount
          )} was successful. You will receive an email shortly. Confirmation ID: ${withdrawConfirmationId}`}
        />
      </div>
    );
  };

  /**
   * Main withdraw form
   */
  const renderFormContent = () => {
    return (
      <div className="WithdrawFundsFormModalContent">
        <div className="WithdrawModalHelpTextContainer">
          <p>
            You are withdrawing funds to your US Debit card ending in&nbsp;
            {selectedBeneficiary.cardNumber}. You have{' '}
            <strong>{formatCurrency(availableBalance)}</strong> available to
            withdraw.
          </p>
        </div>
        <Space className="WithdrawAmountInputContainer">
          <p>Amount:</p>
          <InputNumber
            style={{
              width: '80%',
            }}
            value={selectedAmount}
            formatter={(val) => formatCurrency(val, true)}
            parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, '') ?? '')}
            max={availableBalance}
            min={0}
            onChange={setSelectedAmount}
            disabled={isProcessingWithdrawal}
          />
          <Select defaultValue="USD" disabled>
            <Option value="USD">USD</Option>
          </Select>
        </Space>
        <div>
          <Button
            type="primary"
            loading={isProcessingWithdrawal}
            disabled={isProcessingWithdrawal}
            onClick={onWithdrawButtonClicked}
          >
            Withdraw Now
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title="Withdraw Funds"
      onCancel={() => setIsVisible(false)}
      visible={isVisible}
      className="WithdrawFundsModal"
      footer={null}
    >
      <div className="WithdrawFundsModalContent">
        {withdrawConfirmationId ? renderSuccessContent() : renderFormContent()}
      </div>
    </Modal>
  );
};

export default WithdrawFundsModal;