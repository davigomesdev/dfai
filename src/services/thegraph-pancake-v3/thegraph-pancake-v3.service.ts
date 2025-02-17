import { request } from 'graphql-request';

import { IPool } from '@/interfaces/pool.interface';

import { FindPoolDTO } from './dtos/find-pool.dto';
import { FindPoolsDTO } from './dtos/find-pools.dto';

import { THEGRAPH_PANCAKE_V3 } from '@/constants/env-contants';

import FindPoolQuery from './queries/find-pool.gql';
import FindPoolsQuery from './queries/find-pools.gql';
import ListPoolsQuery from './queries/list-pools.gql';

export const findPool = async (input: FindPoolDTO): Promise<IPool> => {
  const data = await request<{ pools: IPool[] }>(THEGRAPH_PANCAKE_V3, FindPoolQuery, input);
  return data.pools[0];
};

export const findPools = async (input: FindPoolsDTO): Promise<IPool[]> => {
  const data = await request<{ pools: IPool[] }>(THEGRAPH_PANCAKE_V3, FindPoolsQuery, input);
  return data.pools;
};

export const listPools = async (): Promise<IPool[]> => {
  const data = await request<{ pools: IPool[] }>(THEGRAPH_PANCAKE_V3, ListPoolsQuery);
  return data.pools;
};
