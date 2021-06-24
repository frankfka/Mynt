import Cost from '../../../types/Cost';

export default interface DatabaseTokenSale {
  symbol: string; // This is the ID - can only have one sale per symbol
  parentUserId: string;
  unitCost: Cost;
  availableQuantity: number; // Remaining available quantity
  description: string;
}
