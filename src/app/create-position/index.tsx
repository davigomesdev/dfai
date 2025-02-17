import React from 'react';

import { IPool } from '@/interfaces/pool.interface';
import { IToken } from '@/interfaces/token.interface';

import * as ERC20Service from '@/services/erc20/erc20.service';
import * as ThegraphPancakeV3Service from '@/services/thegraph-pancake-v3/thegraph-pancake-v3.service';

import { getParams } from '@/utils/url.util';
import { balanceOfEther } from '@/utils/ethers.util';
import { subDays, getTime } from 'date-fns';
import { formatTruncateDecimal, truncateToDecimals } from '@/utils/format.util';
import { formatUnits, parseUnits } from 'ethers';

import useSWR from 'swr';
import { useToast } from '@/hooks/use-toast';
import { useTokens } from '@/hooks/use-tokens';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { ArrowRightLeft, ChevronDown, Minus, Plus } from 'lucide-react';

import Card from '@/components/common/card';
import Input from '@/components/common/input';
import Button from '@/components/common/button';
import PoolItem from '@/components/items/pool-item';
import Separator from '@/components/common/separator';
import PriceChart from '@/components/charts/price-chart';
import Typography from '@/components/common/typography';
import DefaultIcon from '@/components/partials/default-icon';
import TypingLoader from '@/components/partials/typing-loader';
import LiquidityChart from '@/components/charts/liquidity-chart';
import ListTokensDialog from '@/components/dialogs/list-tokens-dialog';

const dataPrices = [
  { month: 'January', field: 186 },
  { month: 'February', field: 305 },
  { month: 'March', field: 237 },
  { month: 'April', field: 73 },
  { month: 'May', field: 209 },
  { month: 'June', field: 214 },
];

const dataLiquidity = [
  { month: 'January', field: 186 },
  { month: 'February', field: 305 },
  { month: 'March', field: 237 },
  { month: 'April', field: 73 },
  { month: 'May', field: 209 },
  { month: 'June', field: 214 },
  { month: 'January', field: 186 },
  { month: 'February', field: 305 },
  { month: 'March', field: 237 },
  { month: 'April', field: 73 },
  { month: 'May', field: 209 },
  { month: 'June', field: 214 },
  { month: 'January', field: 186 },
  { month: 'February', field: 305 },
  { month: 'March', field: 237 },
  { month: 'April', field: 73 },
  { month: 'May', field: 209 },
  { month: 'June', field: 214 },
];

const CreatePosition: React.FC = () => {
  const paramTokenA = 'tokenA';
  const paramTokenB = 'tokenB';
  const paramPoolTier = 'poolTier';

  const { toast } = useToast();
  const { findToken } = useTokens();

  const [searchParams] = useSearchParams();
  const params = getParams(searchParams);

  const navigate = useNavigate();
  const location = useLocation();

  const [tokenA, setTokenA] = React.useState<IToken | null>(null);
  const [tokenB, setTokenB] = React.useState<IToken | null>(null);
  const [poolTier, setPoolTier] = React.useState<IPool | null>(null);

  const [priceIn, setPriceIn] = React.useState<IToken | null>(null);
  const [minPrice, setMinPrice] = React.useState<string>('');
  const [maxPrice, setMaxPrice] = React.useState<string>('');

  const { data: pools, isLoading } = useSWR<IPool[] | null>(
    `pools/${tokenA?.id}/${tokenB?.id}`,
    async () => {
      if (!tokenA || !tokenB) return null;

      const currentDate = new Date();
      const pastDate = subDays(currentDate, 30);

      const startDate = Math.floor(getTime(pastDate) / 1000);
      const endDate = Math.floor(getTime(currentDate) / 1000);

      return await ThegraphPancakeV3Service.findPools({
        tokenA: tokenA.address.toLowerCase(),
        tokenB: tokenB.address.toLowerCase(),
        startDate,
        endDate,
      });
    },
    { errorRetryCount: 0 },
  );

  const { data: balances } = useSWR<[bigint, bigint]>(
    `balances/${tokenA?.id}/${tokenB?.id}`,
    async () => {
      if (!tokenA || !tokenB) return [0n, 0n];

      const balanceA = tokenA?.isNative
        ? await balanceOfEther()
        : await ERC20Service.balanceOf({ address: tokenA.address });

      const balanceB = tokenB?.isNative
        ? await balanceOfEther()
        : await ERC20Service.balanceOf({ address: tokenB.address });

      return [balanceA, balanceB];
    },
    {
      errorRetryCount: 0,
    },
  );

  const resetForm = (): void => {
    setPoolTier(null);
    setPriceIn(null);
    setMinPrice('');
    setMaxPrice('');
  };

  const findPoolTier = (id: string): IPool | null => {
    return pools
      ? (pools?.find((pool) => pool.id.toLowerCase() === id.toLowerCase()) ?? null)
      : null;
  };

  const findTokenPrice = (id: string): string => {
    return id.toLowerCase() === poolTier!.token0.id.toLowerCase()
      ? poolTier!.token0Price
      : poolTier!.token1Price;
  };

  const calculatePriceRange = (
    price: string,
    range: number,
    decimals: number,
  ): {
    minPrice: string;
    maxPrice: string;
  } => {
    const priceTuncat = truncateToDecimals(price, decimals);
    const priceBigInt = parseUnits(priceTuncat, decimals);

    const rangeFactor = BigInt(Math.floor(range * 100));
    const oneHundred = BigInt(10000);

    const minPrice = (priceBigInt * (oneHundred - rangeFactor)) / oneHundred;
    const maxPrice = (priceBigInt * (oneHundred + rangeFactor)) / oneHundred;

    return {
      minPrice: formatUnits(minPrice, decimals),
      maxPrice: formatUnits(maxPrice, decimals),
    };
  };

  const handleOnSelectPoolTier = (id: string): void => {
    const params = new URLSearchParams(searchParams);

    params.set(paramPoolTier, id);
    const newPath = `${location.pathname}?${params.toString()}`;

    navigate(newPath);
  };

  const handleOnClickIncrementPrice = (price: string, incrementPercentage: number): string => {
    const priceTuncat = truncateToDecimals(price, 18);
    const priceBigInt = parseUnits(price, 18);

    const incrementFactor = BigInt(Math.floor(incrementPercentage * 100));
    const oneHundred = BigInt(10000);

    const newPrice = (priceBigInt * (oneHundred + incrementFactor)) / oneHundred;

    return formatUnits(newPrice, 18);
  };

  // Função para decrementar o preço
  const handleOnClickDecrementPrice = (price: string, decrementPercentage: number): string => {
    // Converte o preço para BigInt (assumindo que o preço está em ether)
    const priceBigInt = parseUnits(price, 18);

    // Calcula o decremento
    const decrementFactor = BigInt(Math.floor(decrementPercentage * 100)); // Multiplica por 100 para evitar decimais
    const oneHundred = BigInt(10000); // 100 * 100 para manter a precisão

    // Calcula o novo preço
    const newPrice = (priceBigInt * (oneHundred - decrementFactor)) / oneHundred;

    // Converte o novo preço de volta para ether
    return formatUnits(newPrice, 18);
  };

  const handleOnClickSetPriceRange = (range: number): void => {
    if (!priceIn || !poolTier) return;

    const price = findTokenPrice(priceIn.id);

    const { minPrice, maxPrice } = calculatePriceRange(price, range, priceIn.decimals);

    setMinPrice(minPrice);
    setMaxPrice(maxPrice);
  };

  const handleOnToggleSetPriceIn = (): void => {
    setPriceIn((priceIn) => (priceIn === tokenA ? tokenB : tokenA));
  };

  const handleOnChangeSetMinPrice = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setMinPrice(value);
  };

  const handleOnChangeSetMaxPrice = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setMaxPrice(value);
  };

  React.useEffect(() => {
    const TOKEN_A_ID = params[paramTokenA];
    const TOKEN_B_ID = params[paramTokenB];
    const POOL_TIER_ID = params[paramPoolTier];

    if (TOKEN_A_ID && (!tokenA || tokenA.id !== TOKEN_A_ID)) {
      resetForm();
      if (TOKEN_A_ID) setTokenA(findToken(TOKEN_A_ID));
      else setTokenA(null);
    }

    if (TOKEN_B_ID && (!tokenB || tokenB.id !== TOKEN_B_ID)) {
      resetForm();
      if (TOKEN_B_ID) setTokenB(findToken(TOKEN_B_ID));
      else setTokenB(null);
    }

    if (!poolTier || poolTier.id !== POOL_TIER_ID) {
      if (POOL_TIER_ID && tokenA && tokenB) {
        const tempPoolTier = findPoolTier(POOL_TIER_ID);

        if (tempPoolTier?.poolDayData.length) {
          setPoolTier(tempPoolTier);
          setPriceIn(tokenA);
        } else {
          setPoolTier(null);
          setPriceIn(null);
        }
      } else {
        setPoolTier(null);
        setPriceIn(null);
      }
    }
  }, [params]);

  const [balanceTokenA, balanceTokenB] = balances ?? [0n, 0n];

  const { maxValue, minValue } = React.useMemo(() => {
    const values = dataPrices.map((item) => item.field);
    return {
      maxValue: Math.max(...values),
      minValue: Math.min(...values),
    };
  }, [dataPrices]);

  return (
    <main className="flex w-full flex-col items-center">
      <header className="w-full max-w-screen-xl p-8 py-10">
        <Typography.H2>Create New Position</Typography.H2>
        <Typography.P className="text-secondary-200">
          Create a position by adding liquidity to a pool
        </Typography.P>
      </header>
      <section className="w-full max-w-screen-lg space-y-12 p-5">
        <Card>
          <Card.Header>
            <Card.Title>Select network and exchange</Card.Title>
            <Card.Description>Select pair of tokens to provide liquidity for</Card.Description>
          </Card.Header>
          <Card.Content className="flex gap-10">
            <ListTokensDialog param={paramTokenA}>
              <button className="flex h-11 w-full max-w-[300px] items-center justify-between rounded-lg border border-secondary-400 px-3 hover:border-primary-500/50 hover:bg-primary-500/10">
                <div className="flex items-center gap-2">
                  {tokenA ? (
                    <>
                      {tokenA.logoURI ? (
                        <img alt="logo" className="w-[25px]" src={tokenA.logoURI} />
                      ) : (
                        <DefaultIcon symbol={tokenA.symbol} />
                      )}
                      <Typography.P>{tokenA.symbol}</Typography.P>
                    </>
                  ) : (
                    <Typography.P>Select token</Typography.P>
                  )}
                </div>
                <ChevronDown size={17} />
              </button>
            </ListTokensDialog>
            <ListTokensDialog param={paramTokenB}>
              <button className="flex h-11 w-full max-w-[300px] items-center justify-between rounded-lg border border-secondary-400 px-3 hover:border-primary-500/50 hover:bg-primary-500/10">
                <div className="flex items-center gap-2">
                  {tokenB ? (
                    <>
                      {tokenB.logoURI ? (
                        <img alt="logo" className="w-[25px]" src={tokenB.logoURI} />
                      ) : (
                        <DefaultIcon symbol={tokenB.symbol} />
                      )}
                      <Typography.P>{tokenB.symbol}</Typography.P>
                    </>
                  ) : (
                    <Typography.P>Select token</Typography.P>
                  )}
                </div>
                <ChevronDown size={17} />
              </button>
            </ListTokensDialog>
          </Card.Content>
          <Card.Footer className="border-t border-secondary-800 bg-secondary-950 py-5">
            <Card.Description>Make sure you choose the correct liquidity pair</Card.Description>
          </Card.Footer>
        </Card>
        {tokenA && tokenB ? (
          isLoading ? (
            <Card>
              <Card.Content className="p-10">
                <TypingLoader />
              </Card.Content>
            </Card>
          ) : pools?.length ? (
            <Card>
              <Card.Header>
                <Card.Title>Select fee tier</Card.Title>
                <Card.Description>Select a pool tier to add liquidity to</Card.Description>
              </Card.Header>
              <Card.Content className="grid grid-cols-4 gap-10">
                {Array(4 - pools.length)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="pointer-events-none opacity-50">
                      <Card.Header className="bg-secondary-950 py-2">
                        <Typography.H4>0.00%</Typography.H4>
                      </Card.Header>
                      <Separator className="bg-secondary-800 transition-colors" />
                      <Card.Content className="p-4">
                        <ul className="space-y-4">
                          <li>
                            <Typography.P className="text-[0.8rem] text-secondary-200">
                              No existing pool for this fee tier
                            </Typography.P>
                          </li>
                        </ul>
                      </Card.Content>
                    </Card>
                  ))}
                {pools.map((pool) => (
                  <PoolItem
                    {...pool}
                    key={pool.id}
                    isActive={poolTier?.id === pool.id}
                    onClick={() => handleOnSelectPoolTier(pool.id)}
                  />
                ))}
              </Card.Content>
            </Card>
          ) : (
            <Card>
              <Card.Header>
                <Card.Title>Select fee tier</Card.Title>
                <Card.Description>Select a pool tier to add liquidity to</Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-2 rounded-lg border border-secondary-800 bg-secondary-950 px-7 py-14">
                  <Typography.P className="text-sm">
                    There are no pool tiers available for this pool pair.
                  </Typography.P>
                  <Typography.P className="text-sm">Please try with other tokens.</Typography.P>
                </div>
              </Card.Content>
            </Card>
          )
        ) : null}
        {poolTier ? (
          <>
            <Card>
              <Card.Header>
                <div className="flex w-full items-end justify-between gap-2">
                  <Card.Title>Select price range</Card.Title>
                  <div className="flex items-center gap-2">
                    <Typography.P className="text-sm">prices in </Typography.P>
                    <Button variant="outlineSecondary" onClick={handleOnToggleSetPriceIn}>
                      <ArrowRightLeft />
                      {priceIn?.symbol}
                    </Button>
                  </div>
                </div>
                <Card.Description>
                  Select the minimum and maximum price where your position would be active.
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 gap-5 p-4 pr-0">
                  <div>
                    <Typography.H4 className="mb-2 text-sm font-normal text-secondary-200">
                      Liquidity distribution
                    </Typography.H4>
                    <LiquidityChart data={dataLiquidity} maxPrice={maxValue} minPrice={minValue} />
                  </div>
                  <div>
                    <Typography.H4 className="mb-2 text-sm font-normal text-secondary-200">
                      Pool historic prices
                    </Typography.H4>
                    <PriceChart data={dataPrices} maxPrice={maxValue} minPrice={minValue} />
                  </div>
                </div>
                <div className="flex w-full justify-center gap-6">
                  <div className="mt-2 flex items-center">
                    <Button
                      className="h-full w-11 rounded-l-lg rounded-r-none"
                      size="icon"
                      variant="outlineSecondary"
                    >
                      <Minus />
                    </Button>
                    <div className="relative">
                      <Typography.P className="absolute left-2 top-1 text-center text-[9px] text-secondary-200">
                        MIN PRICE
                      </Typography.P>
                      <Input
                        className="rounded-none border-x-0 pb-1 pt-4"
                        placeholder="0.0"
                        value={minPrice}
                        onChange={handleOnChangeSetMinPrice}
                      />
                    </div>
                    <Button
                      className="h-full w-11 rounded-l-none rounded-r-lg"
                      size="icon"
                      variant="outlineSecondary"
                    >
                      <Plus />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Button
                      className="h-full w-11 rounded-l-lg rounded-r-none"
                      size="icon"
                      variant="outlineSecondary"
                    >
                      <Minus />
                    </Button>
                    <div className="relative">
                      <Typography.P className="absolute left-2 top-1 text-center text-[9px] text-secondary-200">
                        MAX PRICE
                      </Typography.P>
                      <Input
                        className="rounded-none border-x-0 pb-1 pt-4"
                        placeholder="0.0"
                        value={maxPrice}
                        onChange={handleOnChangeSetMaxPrice}
                      />
                    </div>
                    <Button
                      className="h-full w-11 rounded-l-none rounded-r-lg"
                      size="icon"
                      variant="outlineSecondary"
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
                <ul className="mt-2 flex w-full justify-center gap-2 p-2">
                  <li>
                    <Button size="sm" variant="outlineSecondary">
                      MIN
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleOnClickSetPriceRange(1)}
                    >
                      1%
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleOnClickSetPriceRange(5)}
                    >
                      5%
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleOnClickSetPriceRange(10)}
                    >
                      10%
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleOnClickSetPriceRange(20)}
                    >
                      20%
                    </Button>
                  </li>
                  <li>
                    <Button size="sm" variant="outlineSecondary">
                      FULL
                    </Button>
                  </li>
                </ul>
              </Card.Content>
              <Card.Footer className="border-t border-secondary-800 bg-secondary-950 py-5">
                <Card.Description>Make sure you choose the correct liquidity pair</Card.Description>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Header>
                <div className="flex w-full items-end justify-between gap-2">
                  <Card.Title>Deposit amount</Card.Title>
                  <div>
                    <div className="relative flex w-full max-w-[130px] items-center">
                      <Typography.P className="absolute left-3 top-1 text-center text-[9px] text-secondary-200">
                        Deposit slippage
                      </Typography.P>
                      <Input className="pb-1 pt-4" placeholder="1" />
                      <Typography.P className="absolute right-4">%</Typography.P>
                    </div>
                  </div>
                </div>
                <Card.Description>Add the deposit amounts</Card.Description>
              </Card.Header>
              <Card.Content className="flex gap-6">
                <div className="relative w-full max-w-[300px]">
                  <Typography.P className="absolute left-3 top-1 text-center text-[9px] text-secondary-200">
                    {`${tokenA?.symbol} amount`}
                  </Typography.P>
                  <div className="relative flex items-center">
                    <Input className="pb-1 pt-4" placeholder="0.0" />
                    <Typography.P className="absolute right-4">{tokenA?.symbol}</Typography.P>
                  </div>
                  <div className="mt-2 flex w-full items-center gap-4">
                    <Typography.P className="text-left text-xs text-secondary-200">
                      {`Available ${formatTruncateDecimal(formatUnits(balanceTokenA, tokenA?.decimals), 8)} ${tokenA?.symbol}`}
                    </Typography.P>
                    <Button className="h-5 rounded-md px-2" size="sm" variant="outlineSecondary">
                      MAX
                    </Button>
                  </div>
                </div>
                <div className="relative w-full max-w-[300px]">
                  <Typography.P className="absolute left-3 top-1 text-center text-[9px] text-secondary-200">
                    {`${tokenB?.symbol} amount`}
                  </Typography.P>
                  <div className="relative flex items-center">
                    <Input className="pb-1 pt-4" placeholder="0.0" />
                    <Typography.P className="absolute right-4">{tokenB?.symbol}</Typography.P>
                  </div>
                  <div className="mt-2 flex w-full items-center gap-4">
                    <Typography.P className="text-left text-xs text-secondary-200">
                      {`Available ${formatTruncateDecimal(formatUnits(balanceTokenB, tokenB?.decimals), 8)} ${tokenB?.symbol}`}
                    </Typography.P>
                    <Button className="h-5 rounded-md px-2" size="sm" variant="outlineSecondary">
                      MAX
                    </Button>
                  </div>
                </div>
              </Card.Content>
              <Card.Footer className="border-t border-secondary-800 bg-secondary-950 py-5">
                <Card.Description>Make sure you choose the correct liquidity pair</Card.Description>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Transaction summary</Card.Title>
                <Card.Description>
                  Summary of the new transaction that will be executed
                </Card.Description>
              </Card.Header>
              <Card.Content className="flex gap-10">
                <Card className="max-w-fit bg-black">
                  <Card.Header>
                    <Card.Title>MIN prices</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Typography.P>{`- 0.00000 ${tokenA?.symbol}`}</Typography.P>
                    <Typography.P>{`- 0.00000 ${tokenB?.symbol}`}</Typography.P>
                  </Card.Content>
                </Card>
                <Card className="max-w-fit bg-black">
                  <Card.Header>
                    <Card.Title>MAX prices</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Typography.P>{`- 0.00000 ${tokenA?.symbol}`}</Typography.P>
                    <Typography.P>{`- 0.00000 ${tokenB?.symbol}`}</Typography.P>
                  </Card.Content>
                </Card>
                <Card className="max-w-fit bg-black">
                  <Card.Header>
                    <Card.Title>Deposit amount</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Typography.P>{`- 0.00000 ${tokenA?.symbol}`}</Typography.P>
                    <Typography.P>{`- 0.00000 ${tokenB?.symbol}`}</Typography.P>
                  </Card.Content>
                </Card>
              </Card.Content>
              <Card.Footer className="flex items-center justify-between border-t border-secondary-800 bg-secondary-950 py-5">
                <Card.Description>Make sure you choose the correct liquidity pair</Card.Description>
                <div className="space-x-4">
                  {!tokenA?.isNative ? (
                    <Button variant="outline">{`Approve ${tokenA?.symbol}`}</Button>
                  ) : null}
                  {!tokenB?.isNative ? (
                    <Button variant="outline">{`Approve ${tokenB?.symbol}`}</Button>
                  ) : null}
                  <Button disabled variant="outline">
                    {`Initiate ${tokenA?.symbol}/${tokenB?.symbol} position`}
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </>
        ) : null}
      </section>
    </main>
  );
};

export default CreatePosition;
