const parseFormattedCurrency = (value?: string) =>
  Number(value?.replace(/\$\s?|(,*)/g, '') ?? '');

export default parseFormattedCurrency;
