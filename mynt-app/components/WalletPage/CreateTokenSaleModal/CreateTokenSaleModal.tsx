import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Result,
  Select,
  Space,
} from 'antd';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import CreateUserTokenSaleParams from '../../../services/appService/types/CreateUserTokenSaleParams';
import formatCurrency from '../../../util/formatCurrency';
import parseFormattedCurrency from '../../../util/parseFormattedCurrency';
import UserTokenWalletData from '../types/UserTokenWalletData';

require('./CreateTokenSaleModal.less');

const { Option } = Select;
const { TextArea } = Input;

type CreateTokenSaleFormValues = {
  unitCost: string;
  availableQuantity: number;
  description: string;
};

type Props = {
  userToken: UserTokenWalletData;
  isVisible: boolean;
  setIsVisible(newVal: boolean): void;
  onCreateTokenSaleSuccess(): void;
};

function CreateTokenSaleModal({
  userToken,
  isVisible,
  setIsVisible,
  onCreateTokenSaleSuccess,
}: React.PropsWithoutRef<Props>) {
  const { userData } = useContext(UserContext);
  const [form] = Form.useForm<CreateTokenSaleFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didCreateTokenSale, setDidCreateTokenSale] = useState(false);

  if (userData == null) {
    return null;
  }

  const onFinish = async (values: CreateTokenSaleFormValues) => {
    setIsSubmitting(true);

    const unitCostNumber = parseFormattedCurrency(values.unitCost);

    const createTokenSaleData: CreateUserTokenSaleParams = {
      symbol: userToken.symbol,
      parentUserId: userData.dbData.id,
      unitCost: {
        amount: unitCostNumber,
        currency: 'USD',
      },
      availableQuantity: values.availableQuantity,
      description: values.description,
    };

    try {
      const response = await fetch('/api/token-sale', {
        method: 'POST',
        body: JSON.stringify(createTokenSaleData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw Error(
          'Non-successful response status: ' + JSON.stringify(response)
        );
      }

      // Success
      setDidCreateTokenSale(true);
      onCreateTokenSaleSuccess();
    } catch (err) {
      message.error('Something went wrong. Please try again.');
      console.error('Error creating user token sale from API', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    setIsVisible(false);
  };

  const renderCreateTokenSaleForm = () => {
    return (
      <Form
        layout="vertical"
        form={form}
        requiredMark="optional"
        onFinish={onFinish}
        className="CreateTokenSaleForm"
      >
        <p>
          Sell your {userToken.symbol} on the marketplace by creating a token
          sale.
        </p>
        <Form.Item
          label="Unit Cost"
          rules={[
            {
              required: true,
              message: 'Please specify a unit cost',
            },
          ]}
          name="unitCost"
        >
          <Space>
            <InputNumber
              min={1}
              step={1}
              precision={2}
              disabled={isSubmitting}
              formatter={(newVal) => formatCurrency(newVal, true)}
              parser={parseFormattedCurrency}
            />
            <Select defaultValue="USD" disabled>
              <Option value="USD">USD</Option>
            </Select>
          </Space>
        </Form.Item>
        <Form.Item
          name="availableQuantity"
          label="Available Quantity"
          tooltip="The total number of tokens you would like to sell"
          rules={[
            {
              required: true,
              message: 'Please specify available quantity',
            },
          ]}
        >
          <InputNumber
            min={1}
            step={1}
            precision={0}
            max={userToken.balance}
            disabled={isSubmitting}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea placeholder="Tell us what your token does." rows={3} />
        </Form.Item>
        <Form.Item className="center">
          <Button
            type="primary"
            htmlType="submit"
            className="CreateTokenSaleButton"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Create Token Sale
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderCreateTokenSaleSuccess = () => {
    return (
      <Result
        status="success"
        title="Success!"
        subTitle={`Congratulations! Your token sale for ${userToken.symbol} is now live.`}
        extra={
          <Button type="primary">
            <Link href={`/token-sale/${userToken.symbol}`}>
              View Token Sale
            </Link>
          </Button>
        }
      />
    );
  };

  return (
    <Modal
      title="Create a Token Sale"
      footer={null}
      visible={isVisible}
      onCancel={onClose}
    >
      {didCreateTokenSale
        ? renderCreateTokenSaleSuccess()
        : renderCreateTokenSaleForm()}
    </Modal>
  );
}

export default CreateTokenSaleModal;
