import { Button, Form, Input, InputNumber, message, Modal } from 'antd';
import React, { useContext, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import CreateUserTokenParams from '../../../services/appService/types/CreateUserTokenParams';
import CreateTokenSuccessModalContent from './CreateTokenSuccessModalContent';

require('./CreateTokenModal.less');

type CreateTokenFormValues = {
  symbol: string;
  name: string;
  supply: number;
};

type Props = {
  isVisible: boolean;
  setIsVisible(newVal: boolean): void;
  onCreateTokenSuccess(): void;
};

function CreateTokenModal({
  isVisible,
  setIsVisible,
  onCreateTokenSuccess,
}: React.PropsWithoutRef<Props>) {
  const { userData } = useContext(UserContext);
  const [form] = Form.useForm<CreateTokenFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTokenSymbol, setCreatedTokenSymbol] = useState<string>();

  if (userData == null) {
    return null;
  }

  const onFinish = async (values: CreateTokenFormValues) => {
    console.log('Received values of form: ', values);
    setIsSubmitting(true);

    const createTokenData: CreateUserTokenParams = {
      circulatingSupply: values.supply,
      name: values.name,
      passphrase: userData.dbData.sidechain.passphrase,
      symbol: values.symbol,
    };

    try {
      const response = await fetch('/api/user-token', {
        method: 'POST',
        body: JSON.stringify(createTokenData),
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
      setCreatedTokenSymbol(values.symbol);
      onCreateTokenSuccess();
    } catch (err) {
      message.error('Something went wrong. Please try again.');
      console.error('Error creating user token from API', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onClose = () => {
    setCreatedTokenSymbol(undefined);
    setIsSubmitting(false);
    form.resetFields();
    setIsVisible(false);
  };

  const renderCreateTokenForm = () => {
    return (
      <Form
        layout="vertical"
        form={form}
        hideRequiredMark
        onFinish={onFinish}
        className="CreateTokenForm"
      >
        <Form.Item
          name="symbol"
          label="Symbol"
          rules={[
            {
              required: true,
              message: 'Please specify a symbol for your token',
            },
          ]}
        >
          <Input
            disabled={isSubmitting}
            placeholder="Unique symbol for your token (ex. BTC)"
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: 'Please specify a symbol for your token',
            },
          ]}
        >
          <Input
            disabled={isSubmitting}
            placeholder="Display name for your token"
          />
        </Form.Item>
        <Form.Item
          name="supply"
          label="Available Supply"
          tooltip="The total number of tokens to create for this symbol. You will not be able to create more tokens of the same symbol."
          rules={[
            {
              required: true,
              message: 'Please specify total available supply',
            },
          ]}
        >
          <InputNumber min={1} step={1} precision={0} disabled={isSubmitting} />
        </Form.Item>
        <Form.Item className="center">
          <Button
            type="primary"
            htmlType="submit"
            className="CreateTokenButton"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            Create Token
          </Button>
        </Form.Item>
      </Form>
    );
  };

  const renderCreateTokenSuccess = (symbol: string) => {
    return <CreateTokenSuccessModalContent symbol={symbol ?? ''} />;
  };

  return (
    <Modal
      title="Create a Token"
      footer={null}
      visible={isVisible}
      onCancel={onClose}
    >
      {createdTokenSymbol
        ? renderCreateTokenSuccess(createdTokenSymbol)
        : renderCreateTokenForm()}
    </Modal>
  );
}

export default CreateTokenModal;
