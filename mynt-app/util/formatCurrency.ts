const formatCurrency = (
  amount?: number,
  addSymbolSpacing: boolean = false
): string => {
  return `$${addSymbolSpacing ? ' ' : ''}${amount}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );
};

export default formatCurrency;
