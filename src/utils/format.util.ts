import { Decimal } from 'decimal.js';
import { BigNumberish, formatUnits, parseUnits } from 'ethers';

export const parseNumber = (value: Decimal.Value, unit: number = 18): bigint => {
  const num = truncateNumber(value, unit);
  return parseUnits(num, unit);
};

export const formatNumber = (value: BigNumberish, unit: number = 18): string => {
  const num = truncateNumber(value.toString(), unit);
  return formatUnits(num, unit);
};

export const futureBlockTimestamp = (minutes: number = 0): number => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return currentTimestamp + minutes * 60;
};

export const truncateNumber = (value: Decimal.Value, unit: number = 18): string => {
  if (value.toString().trim() === '') return '0';

  const num = new Decimal(value);

  if (!num.isFinite()) return '0';

  const fixedValue = num.toFixed(unit);
  const [integerPart, decimalPart] = fixedValue.split('.');

  if (!decimalPart) return integerPart;

  let truncatedDecimal = decimalPart.slice(0, unit);
  truncatedDecimal = truncatedDecimal.replace(/0+$/, '');

  if (truncatedDecimal === '') return integerPart;

  return `${integerPart}.${truncatedDecimal}`;
};

export const truncateAddress = (address: string, startLength = 4, endLength = 4): string => {
  if (!address || typeof address !== 'string' || address.length < startLength + endLength) {
    return address;
  }

  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);

  return `${start}...${end}`;
};

export const sanitizedValue = (value: string, decimals: number = 18): string => {
  let sanitized = value.replace(/[^0-9.]/g, '');

  const parts = sanitized.split('.');

  if (parts.length > 1) {
    sanitized = parts[0] + '.' + parts.slice(1).join('');
  }

  if (countDecimals(sanitized) >= decimals) {
    sanitized = truncateNumber(sanitized, decimals);
  }

  return sanitized;
};

export const countDecimals = (value: string): number => {
  const valueStr = value.toString();

  if (valueStr.includes('.')) {
    return valueStr.split('.')[1].length;
  }

  return 0;
};
