export default interface DatabaseTokenRedemption {
  id: string; // Can have multiple redemptions per symbol
  parentUserId: string;
  title: string;
  description: string;
  symbol: string;
  unitCost: number; // In terms of the symbol (must be less than available supply!)
  availableQuantity: number; // Remaining qty
}
