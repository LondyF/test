const DEFAULT_CURRENCY = 'XCG';

export const currencyFormatter =
  (currency: string = DEFAULT_CURRENCY) =>
  (amount: number) => {
    return Number(amount).toLocaleString('nl-NL', {
      style: 'currency',
      currencyDisplay: 'code',
      currency,
      minimumFractionDigits: 2,
    });
  };
