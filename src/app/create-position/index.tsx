import React from 'react';

import { IPool } from '@/interfaces/pool.interface';
import { IToken } from '@/interfaces/token.interface';

import * as ERC20Service from '@/services/erc20/erc20.service';
import * as PancakeV3Factory from '@/services/pancake-v3-factory/pancake-v3-factory.service';
import * as ThegraphPancakeV3Service from '@/services/thegraph-pancake-v3/thegraph-pancake-v3.service';

import { ethers } from 'ethers';
import { Decimal } from 'decimal.js';
import { getParams } from '@/utils/url.util';
import { balanceOfEther } from '@/utils/ethers.util';
import { subDays, getTime } from 'date-fns';
import { formatNumber, parseNumber, sanitizedValue, truncateNumber } from '@/utils/format.util';

import useSWR from 'swr';
import { useForm, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useTokens } from '@/hooks/use-tokens';
import { useWeb3Modal, useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { ArrowRightLeft, ChevronDown, Minus, Plus } from 'lucide-react';

import Form from '@/components/common/form';
import Card from '@/components/common/card';
import Input from '@/components/common/input';
import Button from '@/components/common/button';
import PoolItem from '@/components/items/pool-item';
import Separator from '@/components/common/separator';
import PriceChart from '@/components/charts/price-chart';
import Typography from '@/components/common/typography';
import DefaultIcon from '@/components/partials/default-icon';
import TypingLoader from '@/components/common/typing-loader';
import LiquidityChart from '@/components/charts/liquidity-chart-temp';
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

const paramTokenA = 'tokenA';
const paramTokenB = 'tokenB';
const paramPoolTier = 'poolTier';

const fees = [100, 500, 2500, 10000];

const schema = z
  .object({
    minPrice: z.string().nonempty({
      message: 'Require field',
    }),
    maxPrice: z.string().nonempty({
      message: 'Require field',
    }),
    amountA: z.string().nonempty({
      message: 'Require field',
    }),
    amountB: z.string().nonempty({
      message: 'Require field',
    }),
    slippage: z
      .string()
      .nonempty({
        message: 'Require field',
      })
      .refine(
        (val) => {
          const slippageValue = parseFloat(val);
          return slippageValue >= 0.1 && slippageValue <= 100;
        },
        {
          message: 'Between 0.1% and 100%',
        },
      ),
  })
  .refine((data) => parseFloat(data.minPrice) < parseFloat(data.maxPrice), {
    message: 'Min price must be less than max price',
    path: ['maxPrice'],
  })
  .refine((data) => parseFloat(data.minPrice) < parseFloat(data.maxPrice), {
    message: 'Min price must be less than max price',
    path: ['minPrice'],
  });

const CreatePosition: React.FC = () => {
  const { open } = useWeb3Modal();
  const { toast } = useToast();
  const { findToken } = useTokens();
  const { isConnected, address } = useWeb3ModalAccount();

  const [searchParams] = useSearchParams();
  const params = getParams(searchParams);

  const navigate = useNavigate();
  const location = useLocation();

  const [tokenA, setTokenA] = React.useState<IToken | null>(null);
  const [tokenB, setTokenB] = React.useState<IToken | null>(null);

  const [priceIn, setPriceIn] = React.useState<IToken | null>(null);
  const [poolTier, setPoolTier] = React.useState<IPool | null>(null);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      minPrice: '',
      maxPrice: '',
      amountA: '',
      amountB: '',
      slippage: '',
    },
  });

  const { data: pools, isLoading } = useSWR<IPool[] | null>(
    `pools/${tokenA?.id}/${tokenB?.id}`,
    async () => {
      if (!tokenA || !tokenB) return null;

      const pools: IPool[] = [];
      const poolIds: string[] = [];

      for (const fee of fees) {
        const address = await PancakeV3Factory.getPool({
          tokenA: tokenA.address.toLowerCase(),
          tokenB: tokenB.address.toLowerCase(),
          fee,
        });

        if (address !== ethers.ZeroAddress) {
          poolIds.push(address.toLowerCase());
        }
      }

      const currentDate = new Date();
      const pastDate = subDays(currentDate, 30);

      const startDate = Math.floor(getTime(pastDate) / 1000);
      const endDate = Math.floor(getTime(currentDate) / 1000);

      for (const id of poolIds) {
        const pool = await ThegraphPancakeV3Service.findPool({
          id,
          startDate,
          endDate,
        });

        pools.push(pool);
      }

      return pools;
    },
    { errorRetryCount: 3 },
  );

  const { data: balances = [0n, 0n] } = useSWR<[bigint, bigint]>(
    `balances/${address}/${tokenA?.id}/${tokenB?.id}`,
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
      errorRetryCount: 3,
    },
  );

  const resetForm = (): void => {
    setPoolTier(null);
    setPriceIn(null);
    form.reset();
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
    const priceDecimal = new Decimal(price);
    const rangeFactor = new Decimal(range).div(100);

    const minPrice = priceDecimal.mul(new Decimal(1).sub(rangeFactor));
    const maxPrice = priceDecimal.mul(new Decimal(1).add(rangeFactor));

    return {
      minPrice: truncateNumber(minPrice, decimals),
      maxPrice: truncateNumber(maxPrice, decimals),
    };
  };

  const calculateFullPriceRange = (): {
    minPrice: string;
    maxPrice: string;
  } => {
    return {
      minPrice: '0',
      maxPrice: 'Infinity',
    };
  };

  const handleSetPriceRange = (range: number): void => {
    if (!priceIn || !poolTier) return;

    const price = findTokenPrice(priceIn.id);

    const { minPrice, maxPrice } = calculatePriceRange(price, range, priceIn.decimals);

    form.setValue('minPrice', minPrice);
    form.setValue('maxPrice', maxPrice);
  };

  const handleIncrementPrice = (key: keyof z.infer<typeof schema>): void => {
    const currentValue = form.getValues(key);
    const maxUint256 = BigInt(2) ** BigInt(256) - BigInt(1);

    if (currentValue === 'Infinity' || parseNumber(currentValue) >= maxUint256) {
      form.setValue(key, 'Infinity');
      return;
    }

    const num = new Decimal(Number(currentValue) === 0 ? 0.0001 : currentValue);

    const increment = num.mul(new Decimal(0.0001));
    const newValue = num.add(increment);

    form.setValue(key, truncateNumber(newValue, priceIn?.decimals));
  };

  const handleDecrementPrice = (key: keyof z.infer<typeof schema>): void => {
    const currentValue = form.getValues(key);
    const maxUint256 = BigInt(2) ** BigInt(256) - BigInt(1);

    const num = new Decimal(currentValue === 'Infinity' ? maxUint256.toString() : currentValue);

    const decrement = num.mul(new Decimal(0.0001));
    const newValue = num.sub(decrement);

    form.setValue(key, truncateNumber(newValue, priceIn?.decimals));
  };

  const handleOnSelectPoolTier = (id: string): void => {
    const params = new URLSearchParams(searchParams);

    params.set(paramPoolTier, id);
    const newPath = `${location.pathname}?${params.toString()}`;

    navigate(newPath);
  };

  const handleOnClickConnectWallet = (): void => {
    open();
  };

  const handleOnClickFullPriceRange = (): void => {
    if (!priceIn || !poolTier) return;

    const { minPrice, maxPrice } = calculateFullPriceRange();

    form.setValue('minPrice', minPrice);
    form.setValue('maxPrice', maxPrice);
  };

  const handleOnClickAmountAMAX = (): void => {
    const [amountA] = balances;
    form.setValue('amountA', formatNumber(amountA, tokenA?.decimals));
  };

  const handleOnClickAmountBMAX = (): void => {
    const [, amountB] = balances;
    form.setValue('amountB', formatNumber(amountB, tokenB?.decimals));
  };

  const handleOnToggleSetPriceIn = (): void => {
    setPriceIn((priceIn) => (priceIn === tokenA ? tokenB : tokenA));
  };

  const handleOnSubmitAddLiquidity = async (values: z.infer<typeof schema>): Promise<void> => {
    console.log(values);
  };

  React.useEffect(() => {
    if (priceIn && poolTier) {
      handleSetPriceRange(1);
    }
  }, [priceIn, poolTier]);

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
      resetForm();
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

  const [balanceTokenA, balanceTokenB] = balances;

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
            <Card.Title>Select tokens</Card.Title>
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
              <Card.Content className="space-y-2 p-10">
                <div className="w-full rounded-md bg-gradient-to-r from-secondary-950 to-secondary-950/0 p-4">
                  <TypingLoader text="Fetching pool data" />
                  <TypingLoader text="Fetching pool period data" />
                  <TypingLoader text="Fetching pool tier data" />
                  <TypingLoader text="Loading pool tier..." />
                </div>
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
          <Form {...form}>
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
                  <Form.Field
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => {
                      const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                        const value = sanitizedValue(event.target.value, tokenA?.decimals);
                        field.onChange(value);
                      };

                      return (
                        <Form.Item>
                          <Form.Control>
                            <div className="mt-2 flex items-center">
                              <Button
                                className="h-11 w-11 rounded-l-lg rounded-r-none"
                                size="icon"
                                variant="outlineSecondary"
                                onClick={() => handleDecrementPrice('minPrice')}
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
                                  {...field}
                                  value={field.value}
                                  onChange={handleChange}
                                />
                              </div>
                              <Button
                                className="h-11 w-11 rounded-l-none rounded-r-lg"
                                size="icon"
                                variant="outlineSecondary"
                                onClick={() => handleIncrementPrice('minPrice')}
                              >
                                <Plus />
                              </Button>
                            </div>
                          </Form.Control>
                          <Form.Message className="text-center" />
                        </Form.Item>
                      );
                    }}
                  />
                  <Form.Field
                    control={form.control}
                    name="maxPrice"
                    render={({ field }) => {
                      const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                        const value = sanitizedValue(event.target.value, tokenB?.decimals);
                        field.onChange(value);
                      };

                      return (
                        <Form.Item>
                          <Form.Control>
                            <div className="mt-2 flex items-center">
                              <Button
                                className="h-11 w-11 rounded-l-lg rounded-r-none"
                                size="icon"
                                variant="outlineSecondary"
                                onClick={() => handleDecrementPrice('maxPrice')}
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
                                  {...field}
                                  value={field.value}
                                  onChange={handleChange}
                                />
                              </div>
                              <Button
                                className="h-11 w-11 rounded-l-none rounded-r-lg"
                                size="icon"
                                variant="outlineSecondary"
                                onClick={() => handleIncrementPrice('maxPrice')}
                              >
                                <Plus />
                              </Button>
                            </div>
                          </Form.Control>
                          <Form.Message className="text-center" />
                        </Form.Item>
                      );
                    }}
                  />
                </div>
                <ul className="mt-2 flex w-full justify-center gap-2 p-2">
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleSetPriceRange(1)}
                    >
                      MIN
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleSetPriceRange(1)}
                    >
                      1%
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleSetPriceRange(5)}
                    >
                      5%
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleSetPriceRange(10)}
                    >
                      10%
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={() => handleSetPriceRange(20)}
                    >
                      20%
                    </Button>
                  </li>
                  <li>
                    <Button
                      size="sm"
                      variant="outlineSecondary"
                      onClick={handleOnClickFullPriceRange}
                    >
                      FULL
                    </Button>
                  </li>
                </ul>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <div className="flex w-full items-end justify-between gap-2">
                  <Card.Title>Deposit amount</Card.Title>
                  <div>
                    <Form.Field
                      control={form.control}
                      name="slippage"
                      render={({ field }) => {
                        const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                          const value = sanitizedValue(event.target.value, 2);
                          field.onChange(value);
                        };

                        return (
                          <Form.Item>
                            <Form.Control>
                              <div className="relative flex w-full max-w-[130px] items-center">
                                <Typography.P className="absolute left-3 top-1 text-center text-[9px] text-secondary-200">
                                  Deposit slippage
                                </Typography.P>
                                <Input
                                  className="pb-1 pr-8 pt-4"
                                  placeholder="1"
                                  {...field}
                                  value={field.value}
                                  onChange={handleChange}
                                />
                                <Typography.P className="absolute right-4">%</Typography.P>
                              </div>
                            </Form.Control>
                            <Form.Message />
                          </Form.Item>
                        );
                      }}
                    />
                  </div>
                </div>
                <Card.Description>Add the deposit amounts</Card.Description>
              </Card.Header>
              <Card.Content className="flex gap-6">
                <div className="relative w-full max-w-[300px]">
                  <Typography.P className="absolute left-3 top-1 text-center text-[9px] text-secondary-200">
                    {`${tokenA?.symbol} amount`}
                  </Typography.P>
                  <Form.Field
                    control={form.control}
                    name="amountA"
                    render={({ field }) => {
                      const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                        const value = sanitizedValue(event.target.value, tokenA?.decimals);
                        field.onChange(value);
                      };

                      return (
                        <Form.Item>
                          <Form.Control>
                            <div className="relative flex items-center">
                              <Input
                                className="pb-1 pr-16 pt-4"
                                placeholder="0.0"
                                {...field}
                                value={field.value}
                                onChange={handleChange}
                              />
                              <Typography.P className="absolute right-4">
                                {tokenA?.symbol}
                              </Typography.P>
                            </div>
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      );
                    }}
                  />
                  <div className="mt-2 flex w-full items-center gap-4 bg-black">
                    <Typography.P className="text-left text-xs text-secondary-200">
                      {`Available ${formatNumber(balanceTokenA, tokenA?.decimals)} ${tokenA?.symbol}`}
                    </Typography.P>
                    <Button
                      className="h-5 rounded-md px-2"
                      size="sm"
                      variant="outlineSecondary"
                      onClick={handleOnClickAmountAMAX}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
                <div className="relative w-full max-w-[300px]">
                  <Typography.P className="absolute left-3 top-1 text-center text-[9px] text-secondary-200">
                    {`${tokenB?.symbol} amount`}
                  </Typography.P>
                  <Form.Field
                    control={form.control}
                    name="amountB"
                    render={({ field }) => {
                      const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
                        const value = sanitizedValue(event.target.value, tokenB?.decimals);
                        field.onChange(value);
                      };

                      return (
                        <Form.Item>
                          <Form.Control>
                            <div className="relative flex items-center">
                              <Input
                                className="pb-1 pr-16 pt-4"
                                placeholder="0.0"
                                {...field}
                                value={field.value}
                                onChange={handleChange}
                              />
                              <Typography.P className="absolute right-4">
                                {tokenB?.symbol}
                              </Typography.P>
                            </div>
                          </Form.Control>
                          <Form.Message />
                        </Form.Item>
                      );
                    }}
                  />
                  <div className="mt-2 flex w-full items-center gap-4 bg-black">
                    <Typography.P className="text-left text-xs text-secondary-200">
                      {`Available ${formatNumber(balanceTokenB, tokenB?.decimals)} ${tokenB?.symbol}`}
                    </Typography.P>
                    <Button
                      className="h-5 rounded-md px-2"
                      size="sm"
                      variant="outlineSecondary"
                      onClick={handleOnClickAmountBMAX}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
              </Card.Content>
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
                    <Typography.P>{`- ${form.watch('amountA')} ${tokenA?.symbol}`}</Typography.P>
                    <Typography.P>{`- ${form.watch('amountB')} ${tokenB?.symbol}`}</Typography.P>
                  </Card.Content>
                </Card>
              </Card.Content>
              <Card.Footer className="flex items-center justify-end border-t border-secondary-800 bg-secondary-950 py-5">
                {!isConnected ? (
                  <Button variant="outline" onClick={handleOnClickConnectWallet}>
                    Connect wallet
                  </Button>
                ) : (
                  <div className="space-x-4">
                    {!tokenA?.isNative ? (
                      <Button variant="outline">{`Approve ${tokenA?.symbol}`}</Button>
                    ) : null}
                    {!tokenB?.isNative ? (
                      <Button variant="outline">{`Approve ${tokenB?.symbol}`}</Button>
                    ) : null}
                    <Button
                      variant="outline"
                      onClick={() => form.handleSubmit(handleOnSubmitAddLiquidity)()}
                    >
                      {`Initiate ${tokenA?.symbol}/${tokenB?.symbol} position`}
                    </Button>
                  </div>
                )}
              </Card.Footer>
            </Card>
          </Form>
        ) : null}
      </section>
    </main>
  );
};

export default CreatePosition;
