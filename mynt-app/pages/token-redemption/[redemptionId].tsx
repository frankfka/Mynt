import { useRouter } from 'next/router';
import React from 'react';
import TokenRedemptionPage from '../../components/TokenRedemptionPage/TokenRedemptionPage';

const TokenRedemption: React.FC = () => {
  const router = useRouter();
  const { redemptionId } = router.query;

  if (!redemptionId || typeof redemptionId !== 'string') {
    return null;
  }

  return <TokenRedemptionPage redemptionId={redemptionId} />;
};

export default TokenRedemption;
