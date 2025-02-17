export interface IToken {
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logoURI: string | null;
  isNative: boolean;
}
