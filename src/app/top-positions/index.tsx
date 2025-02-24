import React from 'react';

import * as ThegraphPancakeV3 from '@/services/thegraph-pancake-v3/thegraph-pancake-v3.service';

import { PageUrlEnum } from '@/enums/page-url.enum';

import { truncateAddress } from '@/utils/format.util';

import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';

import Card from '@/components/common/card';
import DataGrid from '@/components/common/data-grid';
import Pagination from '@/components/common/pagination';
import Typography from '@/components/common/typography';
import TypingLoader from '@/components/common/typing-loader';

const TopPositions: React.FC = () => {
  const currentPage = 1;
  const lastPage = 15;

  const navigate = useNavigate();

  const { data: pools, isLoading } = useSWR('pools', ThegraphPancakeV3.listPools);

  const calculateFeeAPR = (volume: number, feeTier: number, tvl: number): number => {
    const fee = feeTier / 10000;
    return ((volume * fee) / tvl) * 100;
  };

  const handleOnClickPool = (id: string): void => {
    navigate(`${PageUrlEnum.POOL}/${id}`);
  };

  return (
    <main className="w-full">
      <header className="flex w-full justify-center bg-secondary-950">
        <div className="relative flex h-full w-full max-w-screen-xl justify-between overflow-hidden p-8 py-10">
          <div className="space-y-4">
            <Typography.H1 className="font-semibold">Open positions</Typography.H1>
            <Typography.H4 className="text-secondary-200">Liquidity Pools</Typography.H4>
          </div>
          <img
            alt="boot"
            className="absolute -bottom-[60%] right-0 w-[300px]"
            src="/boot-gif.gif"
          />
        </div>
      </header>
      <section className="mt-5 flex flex-col items-center gap-4 p-10">
        <div className="flex w-full items-center justify-between">
          <Typography.H4 className="text-left">Top positions</Typography.H4>
          <Pagination>
            <Pagination.Prev currentPage={currentPage} />
            <Pagination.Next currentPage={currentPage} lastPage={lastPage} />
          </Pagination>
        </div>
        <DataGrid className="w-full max-w-screen-xl rounded-xl border border-secondary-950 p-5">
          <DataGrid.Header className="sticky top-[55px] grid-cols-6">
            <DataGrid.HeaderCell>POOL</DataGrid.HeaderCell>
            <DataGrid.HeaderCell>NFT</DataGrid.HeaderCell>
            <DataGrid.HeaderCell>ADDRESS</DataGrid.HeaderCell>
            <DataGrid.HeaderCell>FEE TIER</DataGrid.HeaderCell>
            <DataGrid.HeaderCell>APR</DataGrid.HeaderCell>
            <DataGrid.HeaderCell>FEE APR</DataGrid.HeaderCell>
            <DataGrid.HeaderCell>ROI</DataGrid.HeaderCell>
          </DataGrid.Header>
          {isLoading ? (
            <Card className="mt-2">
              <Card.Content className="p-10">
                <div className="w-full rounded-md bg-gradient-to-r from-secondary-900 to-secondary-950/0 p-2 px-4">
                  <TypingLoader text="Fetching LP positions" />
                </div>
              </Card.Content>
            </Card>
          ) : (
            <DataGrid.Body className="mt-2">
              {pools?.map((pool) => {
                const tvl = parseFloat(pool.totalValueLockedUSD);
                const volume = parseFloat(pool.volumeUSD);
                const feeTier = parseFloat(pool.feeTier);
                const feeAPR = calculateFeeAPR(volume, feeTier, tvl);
                const roi = feeAPR;

                return (
                  <DataGrid.BodyRow
                    key={pool.id}
                    className="cursor-pointer grid-cols-6 hover:bg-secondary-950/80"
                    onClick={() => handleOnClickPool(pool.id)}
                  >
                    <DataGrid.BodyCell className="uppercase">{`${pool.token0.symbol}/${pool.token1.symbol}`}</DataGrid.BodyCell>
                    <DataGrid.BodyCell className="font-semibold text-primary-300">
                      {truncateAddress(pool.id)}
                    </DataGrid.BodyCell>
                    <DataGrid.BodyCell className="font-semibold text-secondary-200">
                      {(feeTier / 10000).toFixed(2)}%
                    </DataGrid.BodyCell>
                    <DataGrid.BodyCell className="font-semibold text-green-200">
                      125.40%
                    </DataGrid.BodyCell>
                    <DataGrid.BodyCell>{feeAPR.toFixed(2)}%</DataGrid.BodyCell>
                    <DataGrid.BodyCell className="font-semibold text-green-200">
                      {roi.toFixed(2)}%
                    </DataGrid.BodyCell>
                  </DataGrid.BodyRow>
                );
              })}
            </DataGrid.Body>
          )}
        </DataGrid>
        <Pagination className="mt-5">
          <Pagination.Prev currentPage={currentPage} />
          {lastPage > 2 ? (
            <>
              <Pagination.Link
                disabled={currentPage <= 1}
                page={currentPage > 1 ? currentPage - 1 : 1}
              />
              <Pagination.Link isActive page={currentPage} />
              <Pagination.Link
                disabled={currentPage >= lastPage}
                page={currentPage < lastPage ? currentPage + 1 : lastPage}
              />
            </>
          ) : (
            <>
              <Pagination.Link disabled={lastPage < 1} isActive={currentPage === 1} page={1} />
              <Pagination.Link disabled={lastPage < 2} isActive={currentPage === 2} page={2} />
              <Pagination.Link disabled={lastPage < 3} isActive={currentPage === 3} page={3} />
            </>
          )}
          <Pagination.Next currentPage={currentPage} lastPage={lastPage} />
        </Pagination>
      </section>
    </main>
  );
};

export default TopPositions;
