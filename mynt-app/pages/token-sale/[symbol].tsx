import { useRouter } from 'next/router';
import React from 'react';
import TokenSalePage from '../../components/TokenSalePage/TokenSalePage';

const TokenSale: React.FC = () => {
  const router = useRouter();
  const { symbol } = router.query;

  if (!symbol || typeof symbol !== 'string') {
    return null;
  }

  return <TokenSalePage symbol={symbol} />;
};

export default TokenSale;
