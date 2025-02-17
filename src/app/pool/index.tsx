import React from 'react';

import { IPool } from '@/interfaces/pool.interface';
import { IToken } from '@/interfaces/token.interface';

import { PageUrlEnum } from '@/enums/page-url.enum';

import * as ThegraphPancakeV3Service from '@/services/thegraph-pancake-v3/thegraph-pancake-v3.service';

import { cn } from '@/utils/cn.util';
import { buttonVariants } from '@/components/common/button';

import useSWR from 'swr';
import { useTokens } from '@/hooks/use-tokens';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Card from '@/components/common/card';
import TypingLoader from '@/components/partials/typing-loader';
import DefaultIcon from '@/components/partials/default-icon';
import Typography from '@/components/common/typography';
import { formatUnits, parseUnits } from 'ethers';
import { truncateToDecimals } from '@/utils/format.util';

const Pool: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { importToken } = useTokens();

  const [tokenA, setTokenA] = React.useState<IToken | null>(null);
  const [tokenB, setTokenB] = React.useState<IToken | null>(null);

  const {
    data: pool,
    isLoading,
    error,
  } = useSWR<IPool>(`pool/${id}`, async () => ThegraphPancakeV3Service.findPool({ id: id! }));

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

  return (
    <main className="flex w-full flex-col items-center">
      <section className="w-full max-w-screen-lg space-y-12 p-5">
        {isLoading || !tokenA || !tokenB || !pool ? (
          <Card>
            <Card.Content className="p-10">
              <TypingLoader />
            </Card.Content>
          </Card>
        ) : (
          <>
            <Card>
              <Card.Content className="flex items-center justify-between p-5">
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
                  <Typography.P className="text-secondary-200">current pool price</Typography.P>
                  <Typography.P className="flex items-center gap-2 text-lg font-semibold">
                    {truncateToDecimals(
                      formatUnits(
                        parseUnits(
                          truncateToDecimals(pool.token1Price, tokenA.decimals),
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
                  <Typography.P className="text-secondary-200">TVL</Typography.P>
                  <Typography.P className="flex items-center gap-2 text-lg font-semibold">
                    ${0.0}
                  </Typography.P>
                </div>
                <div>
                  <Typography.P className="text-secondary-200">volume 24h</Typography.P>
                  <Typography.P className="flex items-center gap-2 text-lg font-semibold">
                    ${0.0}
                  </Typography.P>
                </div>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Pool performance charts</Card.Title>
              </Card.Header>
              <Card.Content className="p-5"></Card.Content>
              <Card.Footer className="border-t border-secondary-800 bg-secondary-950 py-5">
                <Card.Description>Make sure you choose the correct liquidity pair</Card.Description>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>{`${tokenA.symbol}/${tokenB.symbol} open positions`}</Card.Title>
              </Card.Header>
              <Card.Content className="p-5"></Card.Content>
              <Card.Footer className="flex items-center justify-between border-t border-secondary-800 bg-secondary-950 py-5">
                <Card.Description>Make sure you choose the correct liquidity pair</Card.Description>
                <div className="space-x-4">
                  <Link
                    className={cn(buttonVariants({ variant: 'outline' }))}
                    to={`${PageUrlEnum.CREATE_POSITION}?tokenA=${tokenA.id}&tokenB=${tokenB.id}&poolTier=${pool?.id}`}
                  >
                    {`Create ${tokenA.symbol}/${tokenB.symbol} position`}
                  </Link>
                </div>
              </Card.Footer>
            </Card>
          </>
        )}
      </section>
    </main>
  );
};

export default Pool;
