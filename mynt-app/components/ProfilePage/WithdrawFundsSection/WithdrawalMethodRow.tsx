import { CreditCardOutlined } from '@ant-design/icons';
import { Image, Row, Col, Divider } from 'antd';
import React from 'react';

function WithdrawalMethodRow() {
  const onRowClicked = () => {
    console.log('Row clicked!');
  };

  return (
    <Row className="WithdrawalMethodRow" align="middle" onClick={onRowClicked}>
      {/*Card Icon*/}
      <Col>
        <div className="CardIconContainer">
          <CreditCardOutlined className="CardIcon" />
        </div>
      </Col>

      {/*Payee Information*/}
      <Col className="BeneficiaryDetailsContainer" flex="auto">
        <h3 className="BeneficiaryName">Frank Jia</h3>
        <small className="BeneficiaryEmail">jiafrank98@gmail.com</small>
      </Col>
      <Col className="PayoutDetailsContainer">
        <Row align="middle" justify="end">
          <Image
            src="https://icons.iconarchive.com/icons/wikipedia/flags/512/US-United-States-Flag-icon.png"
            className="CountryIcon"
          />
          <h3 className="PayoutTitle">US Debit</h3>
        </Row>
        <Row align="middle" justify="end">
          <small className="PayoutDetailsItem">Ending in: 1111</small>
          <small className="PayoutDetailsItem">Exp: 12/22</small>
        </Row>
      </Col>
    </Row>
  );
}

export default WithdrawalMethodRow;
