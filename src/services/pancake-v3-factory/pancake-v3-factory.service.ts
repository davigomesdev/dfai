import PancakeV3Factory from '@/assets/metadata/PancakeV3Factory.json';

import { PANCAKE_V3_FACTORY } from '@/constants/env-contants';

import { GetPoolDTO } from './dtos/get-pool.dto';
import { FeeAmountTickSpacingDTO } from './dtos/fee-amount-tick-spacing.dto';

import { instanceContract } from '@/utils/ethers.util';

import { ethers, isAddress } from 'ethers';

export const getPool = async (input: GetPoolDTO): Promise<string> => {
  const { tokenA, tokenB, fee } = input;

  const [token0, token1] =
    tokenA.toLowerCase() < tokenB.toLowerCase() ? [tokenA, tokenB] : [tokenB, tokenA];

  const contract = await instanceContract(PANCAKE_V3_FACTORY, PancakeV3Factory.abi);
  const poolAddress = await contract.getPool(token0, token1, fee);

  if (!isAddress(poolAddress) || poolAddress === ethers.ZeroAddress) {
    throw new Error('Token pair not found for specified rates.');
  }

  return poolAddress;
};

export const feeAmountTickSpacing = async (input: FeeAmountTickSpacingDTO): Promise<number> => {
  const contract = await instanceContract(PANCAKE_V3_FACTORY, PancakeV3Factory.abi);
  const tickSpacing = await contract.feeAmountTickSpacing(input.fee);

  return tickSpacing;
};
