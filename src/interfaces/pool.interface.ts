export interface IPool {
  id: string;
  token0: IPoolToken;
  token1: IPoolToken;
  feeTier: string;
  feesUSD: string;
  volumeUSD: string;
  liquidity: string;
  token0Price: string;
  token1Price: string;
  totalValueLockedUSD: string;
  poolDayData: IPoolDayData[];
}

export interface IPoolToken {
  id: string;
  symbol: string;
  decimals: number;
}

export interface IPoolDayData {
  tvlUSD: string;
  feesUSD: string;
  volumeUSD: string;
  date: number;
}
