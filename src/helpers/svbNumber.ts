export const getSvbNumberPrefix = (idNummer = '') => idNummer.slice(2, 10);

export const getSvbNumberLastDigit = (svb001?: string | number) => {
  const value = svb001 == null ? '' : String(svb001);

  if (/^\d{9}$/.test(value)) {
    return value.slice(-1);
  }

  if (/^\d$/.test(value)) {
    return value;
  }

  return '0';
};

export const sanitizeSvbNumberLastDigit = (value: string) =>
  value.replace(/\D/g, '').slice(-1);
