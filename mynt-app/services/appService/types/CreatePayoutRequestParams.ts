import Cost from '../../../types/Cost';

export default interface CreatePayoutRequestParams {
  ewalletId: string;
  beneficiaryId: string;
  payoutAmount: Cost;
}
