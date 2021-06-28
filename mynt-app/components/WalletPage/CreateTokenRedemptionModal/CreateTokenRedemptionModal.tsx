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
import CreateUserTokenRedemptionParams from '../../../services/appService/types/CreateUserTokenRedemptionParams';
import formatCurrency from '../../../util/formatCurrency';
import parseFormattedCurrency from '../../../util/parseFormattedCurrency';
import UserTokenWalletData from '../types/UserTokenWalletData';

require('./CreateTokenRedemptionModal.less');

const { Option } = Select;
const { TextArea } = Input;

/*
  title: string;
  description: string;
  symbol: string;
  unitCost: number; // In terms of the symbol (must be less than available supply!)
  availableQuantity: number; // Remaining qty
 */
type CreateTokenRedemptionFormValues = {
  title: string;
  description: string;
  unitCost: number;
  availableQuantity: number;
};

type Props = {
  userToken: UserTokenWalletData;
  isVisible: boolean;
  setIsVisible(newVal: boolean): void;
  onCreateTokenRedemptionSuccess(): void;
};

function CreateTokenRedemptionModal({
  userToken,
  isVisible,
  setIsVisible,
  onCreateTokenRedemptionSuccess,
}: React.PropsWithoutRef<Props>) {
  const { userData } = useContext(UserContext);
  const [form] = Form.useForm<CreateTokenRedemptionFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTokenRedemptionId, setCreatedTokenRedemptionId] =
    useState<string>();

  if (userData == null) {
    return null;
  }

  const onFinish = async (values: CreateTokenRedemptionFormValues) => {
    setIsSubmitting(true);

    const createTokenRedemptionData: CreateUserTokenRedemptionParams = {
      symbol: userToken.symbol,
      parentUserId: userData.dbData.id,
      unitCost: values.unitCost,
      availableQuantity: values.availableQuantity,
      title: values.title,
      description: values.description,
    };

    try {
      const response = await fetch('/api/token-redemption', {
        method: 'POST',
        body: JSON.stringify(createTokenRedemptionData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw Error(
          'Non-successful response status: ' + JSON.stringify(response)
        );
      }

      const responseJson = await response.json();
      if (!responseJson.redemptionId) {
        throw Error(
          'No redemptionId found in response: ' + JSON.stringify(responseJson)
        );
      }

      // Success
      setCreatedTokenRedemptionId(responseJson.redemptionId);
      onCreateTokenRedemptionSuccess();
    } catch (err) {
      message.error('Something went wrong. Please try again.');
      console.error('Error creating user token redemption from API', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    setIsVisible(false);
  };

  const renderCreateTokenRedemptionForm = () => {
    return (
      <Form
        layout="vertical"
        form={form}
        requiredMark="optional"
        onFinish={onFinish}
        className="CreateTokenRedemptionForm"
      >
        <p>
          Create an opportunity for users to redeem {userToken.symbol} for a
          product or service.
        </p>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please specify a title',
            },
          ]}
        >
          <Input placeholder="A short title for your redemption" />
        </Form.Item>
        <Form.Item
          label="Unit Cost (Tokens)"
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
              max={userToken.circulatingSupply}
              precision={0}
              disabled={isSubmitting}
            />
          </Space>
        </Form.Item>
        <Form.Item
          name="availableQuantity"
          label="Available Quantity"
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
          <TextArea placeholder="Describe what you're offering." rows={3} />
        </Form.Item>
        <Form.Item className="center">
          <Button
            type="primary"
            htmlType="submit"
            className="CreateTokenRedemptionButton"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Create Token Redemption
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderCreateTokenRedemptionSuccess = (redemptionId: string) => {
    return (
      <Result
        status="success"
        title="Success!"
        subTitle={`Congratulations! Your token redemption for ${userToken.symbol} is now live.`}
        extra={
          <Button type="primary">
            <Link href={`/token-redemption/${redemptionId}`}>
              View Token Redemption
            </Link>
          </Button>
        }
      />
    );
  };

  return (
    <Modal
      title="Create a Token Redemption"
      footer={null}
      visible={isVisible}
      onCancel={onClose}
    >
      {createdTokenRedemptionId
        ? renderCreateTokenRedemptionSuccess(createdTokenRedemptionId)
        : renderCreateTokenRedemptionForm()}
    </Modal>
  );
}

export default CreateTokenRedemptionModal;
