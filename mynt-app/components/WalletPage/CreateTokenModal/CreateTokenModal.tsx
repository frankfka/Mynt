import { Button, Form, Input, InputNumber, Modal } from 'antd';
import React, { useState } from 'react';
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
};

function CreateTokenModal({
  isVisible,
  setIsVisible,
}: React.PropsWithoutRef<Props>) {
  const [form] = Form.useForm<CreateTokenFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTokenSymbol, setCreatedTokenSymbol] = useState<string>();

  const onFinish = (values: CreateTokenFormValues) => {
    console.log('Received values of form: ', values);
    setIsSubmitting(true);
    // TODO: Call api
    setTimeout(() => setIsSubmitting(false), 5000);
  };

  const onClose = () => {
    setCreatedTokenSymbol(undefined);
    setIsSubmitting(false);
    form.resetFields();
    setIsVisible(false);
  };

  return (
    <Modal
      title="Create a Token"
      footer={null}
      visible={isVisible}
      onCancel={onClose}
    >
      <CreateTokenSuccessModalContent symbol={'TODO'} />
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
    </Modal>
  );
}

export default CreateTokenModal;
