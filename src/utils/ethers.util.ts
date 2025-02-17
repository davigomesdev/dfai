import { RPC_URL } from '@/constants/env-contants';

import { web3Modal } from '@/context/web3modal';

import { Contract } from 'ethers';
import {
  BrowserProvider,
  Eip1193Provider,
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
  Signer,
} from 'ethers/providers';

export const walletProvider = (): Eip1193Provider | null => {
  try {
    const provider: any = web3Modal.getWalletProvider();
    if (!provider) {
      return null;
    }

    return provider;
  } catch {
    return null;
  }
};

export const balanceOfEther = async (): Promise<bigint> => {
  const eip1193Provider = walletProvider();

  if (!eip1193Provider) return 0n;

  const provider: BrowserProvider = new BrowserProvider(eip1193Provider);
  const signer: JsonRpcSigner = await provider.getSigner();
  const account: string = await signer.getAddress();

  const balance: bigint = await provider.getBalance(account);
  return balance;
};

export const currentAccount = async (): Promise<string> => {
  const eip1193Provider = walletProvider();

  if (!eip1193Provider) {
    throw new Error('User not logged in');
  }

  const provider: BrowserProvider = new BrowserProvider(eip1193Provider);

  const signer: JsonRpcSigner = await provider.getSigner();
  const account: string = await signer.getAddress();

  return account;
};

export const instanceContract = async (address: string, abi: any): Promise<Contract> => {
  const eip1193Provider = walletProvider();

  const provider = eip1193Provider
    ? new BrowserProvider(eip1193Provider)
    : new JsonRpcProvider(RPC_URL);

  let signer: Signer | Provider;
  if (provider instanceof BrowserProvider) {
    signer = await provider.getSigner();
  } else {
    signer = provider;
  }

  const contract = new Contract(address, abi, signer);

  return contract;
};
