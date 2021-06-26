import { Result } from 'antd';
import React from 'react';

type Props = {
  symbol: string;
};

function CreateTokenSuccessModalContent({
  symbol,
}: React.PropsWithoutRef<Props>) {
  return (
    <Result
      status="success"
      title="Success!"
      subTitle={`Your token with symbol ${symbol} was created successfully. It should show up in your wallet within 10 seconds. Congratulations!`}
    />
  );
}

export default CreateTokenSuccessModalContent;
