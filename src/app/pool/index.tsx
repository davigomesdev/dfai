import React from 'react';

import { IPool } from '@/interfaces/pool.interface';
import { IToken } from '@/interfaces/token.interface';

import { PageUrlEnum } from '@/enums/page-url.enum';

import * as ThegraphPancakeV3Service from '@/services/thegraph-pancake-v3/thegraph-pancake-v3.service';

import numeral from 'numeral';
import { cn } from '@/utils/cn.util';
import { buttonVariants } from '@/components/common/button';
import { truncateNumber } from '@/utils/format.util';
import { getTime, subHours } from 'date-fns';
import { formatUnits, parseUnits } from 'ethers';

import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';
import { useTokens } from '@/hooks/use-tokens';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Files } from 'lucide-react';

import Tabs from '@/components/common/tabs';
import Card from '@/components/common/card';
import TVLChart from '@/components/charts/tvl-chart';
import Separator from '@/components/common/separator';
import FeesChart from '@/components/charts/fees-chart';
import Typography from '@/components/common/typography';
import VolumeChart from '@/components/charts/volume-chart';
import DefaultIcon from '@/components/partials/default-icon';
import TypingLoader from '@/components/common/typing-loader';

const Pool: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { toast } = useToast();
  const { importToken } = useTokens();

  const [tokenA, setTokenA] = React.useState<IToken | null>(null);
  const [tokenB, setTokenB] = React.useState<IToken | null>(null);

  const {
    data: pool,
    isLoading,
    error,
  } = useSWR<IPool>(`pool/${id}`, async () => {
    const poolId = id!.toLowerCase();
    const currentDate = new Date();
    const pastDate = subHours(currentDate, 24);

    const startDate = Math.floor(getTime(pastDate) / 1000);
    const endDate = Math.floor(getTime(currentDate) / 1000);

    return await ThegraphPancakeV3Service.findPool({
      id: poolId,
      startDate,
      endDate,
    });
  });

  const handleOnClickCopy = (text: string, description: string): void => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description,
      });
    });
  };

  React.useEffect(() => {
    if (pool) {
      const setTokens = async (): Promise<void> => {
        const A = await importToken(pool.token0.id);
        const B = await importToken(pool.token1.id);

        setTokenA(A);
        setTokenB(B);
      };

      setTokens();
    }
  }, [pool]);

  React.useEffect(() => {
    if (error) navigate(PageUrlEnum.TOP_POSITIONS);
  }, [error]);

  const tvl24h = pool?.poolDayData.reduce((total, day) => total + parseFloat(day.tvlUSD), 0) ?? 0;

  const volume24h =
    pool?.poolDayData.reduce((total, day) => total + parseFloat(day.volumeUSD), 0) ?? 0;

  const feeGenerated24h =
    pool?.poolDayData.reduce((total, day) => total + parseFloat(day.feesUSD), 0) ?? 0;

  return (
    <main className="flex w-full flex-col items-center">
      <section className="w-full max-w-screen-lg space-y-12 p-5">
        {isLoading || !tokenA || !tokenB || !pool ? (
          <Card>
            <Card.Content className="p-10">
              <div className="w-full rounded-md bg-gradient-to-r from-secondary-900 to-secondary-950/0 p-2 px-4">
                <TypingLoader text={`Loading pool with address ${id}`} />
              </div>
            </Card.Content>
          </Card>
        ) : (
          <>
            <Card>
              <Card.Content className="space-y-4 p-5">
                <div className="flex w-full justify-between gap-2">
                  <div className="flex items-center gap-5">
                    <div className="relative flex h-[45px] w-[80px] items-center">
                      <div className="absolute left-0">
                        {tokenA.logoURI ? (
                          <img alt="logo" className="h-[45px] w-[45px]" src={tokenA.logoURI} />
                        ) : (
                          <DefaultIcon scale={45} symbol={tokenA.symbol} />
                        )}
                      </div>
                      <div className="absolute right-0">
                        {tokenB.logoURI ? (
                          <img alt="logo" className="h-[45px] w-[45px]" src={tokenB.logoURI} />
                        ) : (
                          <DefaultIcon scale={45} symbol={tokenB.symbol} />
                        )}
                      </div>
                    </div>
                    <div>
                      <Typography.H4>{`${tokenA.symbol}/${tokenB.symbol}`}</Typography.H4>
                      <Typography.P className="font-semibold text-secondary-200">
                        {(parseInt(pool.feeTier) / 10000).toFixed(2)}%
                      </Typography.P>
                    </div>
                  </div>
                  <div>
                    <Typography.P className="text-xs text-secondary-200">
                      current pool price
                    </Typography.P>
                    <Typography.P className="flex items-center gap-2 text-lg font-semibold">
                      {truncateNumber(
                        formatUnits(
                          parseUnits(
                            truncateNumber(pool.token1Price, tokenA.decimals),
                            tokenA.decimals,
                          ),
                          tokenA.decimals,
                        ),
                        8,
                      )}{' '}
                      <span className="text-xs font-light text-secondary-200">{`${tokenA.symbol}/${tokenB.symbol}`}</span>
                    </Typography.P>
                  </div>
                  <div>
                    <Typography.P className="text-xs text-secondary-200">TVL 24h</Typography.P>
                    <Typography.P className="flex items-center gap-2 text-lg font-semibold">
                      ${numeral(tvl24h).format('0.00a')}
                    </Typography.P>
                  </div>
                  <div>
                    <Typography.P className="text-xs text-secondary-200">volume 24h</Typography.P>
                    <Typography.P className="flex items-center gap-2 text-lg font-semibold">
                      ${numeral(volume24h).format('0.00a')}
                    </Typography.P>
                  </div>
                  <div>
                    <Typography.P className="text-xs text-secondary-200">fees 24h</Typography.P>
                    <Typography.P className="flex items-center gap-2 text-lg font-semibold">
                      ${numeral(feeGenerated24h).format('0.00a')}
                    </Typography.P>
                  </div>
                </div>
                <div className="flex w-full items-center gap-5">
                  <div className="flex h-[25px] items-center gap-2 rounded-lg border border-secondary-500 bg-secondary-500/30 pl-4 pr-2 text-sm text-white">
                    POOL
                    <Separator className="bg-secondary-300" orientation="vertical" />
                    <button
                      onClick={() =>
                        handleOnClickCopy(
                          pool.id,
                          `${tokenA.symbol}/${tokenB.symbol} pool address copied`,
                        )
                      }
                    >
                      <Files size={17} />
                    </button>
                  </div>
                  <div className="flex h-[25px] items-center gap-2 rounded-lg border border-secondary-500 bg-secondary-500/30 pl-4 pr-2 text-sm text-white">
                    {tokenA.symbol}
                    <Separator className="bg-secondary-300" orientation="vertical" />
                    <button
                      onClick={() =>
                        handleOnClickCopy(tokenA.address, `${tokenA.symbol} address copied`)
                      }
                    >
                      <Files size={17} />
                    </button>
                  </div>
                  <div className="flex h-[25px] items-center gap-2 rounded-lg border border-secondary-500 bg-secondary-500/30 pl-4 pr-2 text-sm text-white">
                    {tokenB.symbol}
                    <Separator className="bg-secondary-300" orientation="vertical" />
                    <button
                      onClick={() =>
                        handleOnClickCopy(tokenB.address, `${tokenB.symbol} address copied`)
                      }
                    >
                      <Files size={17} />
                    </button>
                  </div>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Pool performance charts</Card.Title>
              </Card.Header>
              <Card.Content>
                <Tabs className="w-full" defaultValue="volume">
                  <Tabs.List className="w-full justify-start">
                    <Tabs.Trigger value="volume">Volume</Tabs.Trigger>
                    <Tabs.Trigger value="fees">Fees</Tabs.Trigger>
                    <Tabs.Trigger value="tvl">TVL</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="volume">
                    <VolumeChart id={pool.id} />
                  </Tabs.Content>
                  <Tabs.Content value="fees">
                    <FeesChart id={pool.id} />
                  </Tabs.Content>
                  <Tabs.Content value="tvl">
                    <TVLChart id={pool.id} />
                  </Tabs.Content>
                </Tabs>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>{`${tokenA.symbol}/${tokenB.symbol} open positions`}</Card.Title>
                <Card.Description>
                  Only showing positions with over $500 in pooled assets.
                </Card.Description>
              </Card.Header>
              <Card.Content className="flex justify-end">
                <Link
                  className={cn(buttonVariants({ variant: 'outline' }))}
                  to={`${PageUrlEnum.CREATE_POSITION}?tokenA=${tokenA.id}&tokenB=${tokenB.id}&poolTier=${pool?.id}`}
                >
                  {`Create ${tokenA.symbol}/${tokenB.symbol} position`}
                </Link>
              </Card.Content>
            </Card>
          </>
        )}
      </section>
    </main>
  );
};

export default Pool;
