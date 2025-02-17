export const formatTruncateAddress = (address: string, startLength = 4, endLength = 4): string => {
  if (!address || typeof address !== 'string' || address.length < startLength + endLength) {
    return address;
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
};

export const formatTruncateDecimal = (number: number | string, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.trunc(Number(number) * factor) / factor;
};

export const formatFutureBlockTimestamp = (minutes: number = 0): number => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return currentTimestamp + minutes * 60;
};

export const truncateToDecimals = (value: string, unit: number): string => {
  const [integerPart, decimalPart] = value.split('.');

  if (!decimalPart) {
    return value;
  }

  const truncatedDecimal = decimalPart.slice(0, unit);
  return `${integerPart}.${truncatedDecimal}`;
};
