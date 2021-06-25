import { Button, Form, Input, InputNumber, Modal } from 'antd';
import React from 'react';

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

  const onFinish = (values: CreateTokenFormValues) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Modal
      title="Create a Token"
      footer={null}
      visible={isVisible}
      onCancel={() => setIsVisible(false)}
    >
      <Form layout="vertical" form={form} hideRequiredMark onFinish={onFinish}>
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
          <Input placeholder="Unique symbol for your token (ex. BTC)" />
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
          <Input placeholder="Display name for your token" />
        </Form.Item>
        <Form.Item
          name="supply"
          label="Available Supply"
          tooltip="The total number of tokens to create for this symbol. You will not be able to create more tokens of the same symbol."
          rules={[
            {
              required: true,
              message: 'Please specify a name for your token',
            },
          ]}
        >
          <InputNumber min={1} step={1} precision={0} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Token
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateTokenModal;
