'use client';

import { CHAIN_ID, RPC_URL, WALLET_CONNECT_ID } from '@/constants/env-contants';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

const bsc = {
  chainId: CHAIN_ID,
  name: 'Binance Smart Chain',
  currency: 'BNB',
  explorerUrl: 'https://bscscan.com',
  rpcUrl: RPC_URL,
};

const metadata = {
  name: 'DFAI',
  description:
    'Discover the best farming pools with the intelligence of our platform. Simplify your DeFi journey and maximize your earnings.',
  url: 'https://dfai.finance',
  icons: ['https://dfai.finance/logo.png'],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: RPC_URL,
  defaultChainId: CHAIN_ID,
});

export const web3Modal = createWeb3Modal({
  ethersConfig,
  chains: [bsc],
  projectId: WALLET_CONNECT_ID,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: 'dark',
});

export const Web3Modal = ({ children }: any): any => {
  return children;
};
