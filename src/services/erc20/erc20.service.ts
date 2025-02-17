import ERC20 from '@/assets/metadata/ERC20.json';

import { ITokenMetaData } from '@/interfaces/token-metadata.interface';

import { ApproveDTO } from './dtos/approve.dto';
import { AllowanceDTO } from './dtos/allowance.dto';
import { BalanceOfDTO } from './dtos/balance-of.dto';

import { currentAccount, instanceContract } from '@/utils/ethers.util';

import { TransactionResponse } from 'ethers';

export const getMetadata = async (address: string): Promise<ITokenMetaData> => {
  const contract = await instanceContract(address, ERC20.abi);

  const [name, symbol, decimals, totalSupply]: [string, string, number, bigint] = await Promise.all(
    [contract.name(), contract.symbol(), contract.decimals(), contract.totalSupply()],
  );

  return {
    name,
    symbol,
    decimals,
    address,
    totalSupply,
  };
};

export const balanceOf = async (input: BalanceOfDTO): Promise<bigint> => {
  const account = await currentAccount();

  const contract = await instanceContract(input.address, ERC20.abi);
  const balance: bigint = await contract.balanceOf(account);

  return balance;
};

export const allowance = async (input: AllowanceDTO): Promise<bigint> => {
  const { address, spender } = input;

  const account = await currentAccount();
  const contract = await instanceContract(address, ERC20.abi);
  const amount: bigint = await contract.allowance(account, spender);

  return amount;
};

export const approve = async (input: ApproveDTO): Promise<void> => {
  const { address, spender, amount } = input;

  const contract = await instanceContract(address, ERC20.abi);
  const tx: TransactionResponse = await contract.approve(spender, amount);

  await tx.wait();
};
