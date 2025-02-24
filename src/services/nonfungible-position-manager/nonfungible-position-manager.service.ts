import NonfungiblePositionManager from '@/assets/metadata/NonfungiblePositionManager.json';

import { NONFUNGIBLE_POSITION_MANAGER } from '@/constants/env-contants';

import { MintDTO } from './dtos/mint.dto';

import { TransactionResponse } from 'ethers';

import { currentAccount, instanceContract } from '@/utils/ethers.util';

export const mint = async (input: MintDTO): Promise<void> => {
  const {
    payableAmount,
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    deadline,
  } = input;

  const account = await currentAccount();

  const contract = await instanceContract(
    NONFUNGIBLE_POSITION_MANAGER,
    NonfungiblePositionManager.abi,
  );

  const tx: TransactionResponse = await contract.mint(
    token0,
    token1,
    fee,
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    account,
    deadline,
    { value: payableAmount },
  );

  await tx.wait();
};
