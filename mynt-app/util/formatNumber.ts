const numberFormatter = new Intl.NumberFormat();

const formatNumber = (num: number) => {
  return numberFormatter.format(num);
};
export default formatNumber;
