import { CreditCardOutlined } from '@ant-design/icons';
import { Image, Row, Col, Divider, Space } from 'antd';
import React from 'react';
import RapydDebitCardBeneficiary from '../../../services/rapydService/types/RapydDebitCardBeneficiary';

type Props = {
  beneficiary: RapydDebitCardBeneficiary;
  onClick(): void;
};

const WithdrawalMethodRow: React.FC<Props> = ({ onClick, beneficiary }) => {
  return (
    <Row className="WithdrawalMethodRow" align="middle" onClick={onClick}>
      {/*Card Icon*/}
      <Col>
        <div className="CardIconContainer">
          <CreditCardOutlined className="CardIcon" />
        </div>
      </Col>

      {/*Payee Information*/}
      <Col className="BeneficiaryDetailsContainer" flex="auto">
        <h3 className="BeneficiaryName">{beneficiary.name}</h3>
        <small className="BeneficiaryEmail">{beneficiary.email}</small>
      </Col>
      <Col className="PayoutDetailsContainer">
        <Row align="middle" justify="end">
          <Image
            src="https://icons.iconarchive.com/icons/wikipedia/flags/512/US-United-States-Flag-icon.png"
            className="CountryIcon"
          />
          <h3 className="PayoutTitle">US Debit</h3>
        </Row>
        <Space split={<Divider type="vertical" />}>
          <small className="PayoutDetailsItem">
            Ending in: {beneficiary.cardNumber}
          </small>
          <small className="PayoutDetailsItem">
            Exp: {beneficiary.cardExpirationMonth}/
            {beneficiary.cardExpirationYear}
          </small>
        </Space>
      </Col>
    </Row>
  );
};

export default WithdrawalMethodRow;
