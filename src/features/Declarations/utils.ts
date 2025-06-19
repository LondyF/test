const currency = 'XCG';

export const formatCurrency = (amount: number) => {
  return Number(amount).toLocaleString('nl-NL', {
    style: 'currency',
    currencyDisplay: 'code',
    currency,
    minimumFractionDigits: 2,
  });
};
