'use client';

import React from 'react';

import { colors } from '@/constants/colors';

import { IPoolDayData } from '@/interfaces/pool.interface';

import * as ThegraphPancakeV3Service from '@/services/thegraph-pancake-v3/thegraph-pancake-v3.service';

import { cn } from '@/utils/cn.util';
import numeral from 'numeral';
import { fromUnixTime, getTime, startOfDay, subDays } from 'date-fns';

import useSWR from 'swr';

import { Area, AreaChart, CartesianGrid } from 'recharts';

import Button from '../common/button';
import Typography from '../common/typography';
import Chart, { ChartConfig } from '../common/chart';

const config = {
  field: {
    color: '#22c55e',
  },
} satisfies ChartConfig;

interface FeesChartProps {
  id: string;
}

const FeesChart = React.memo<FeesChartProps>(({ id }) => {
  const [days, setDays] = React.useState<number>(30);

  const { data: poolDayData, isLoading } = useSWR<IPoolDayData[]>(
    `poolDayDate/${id}/${days}`,
    async () => {
      const poolId = id.toLowerCase();
      const currentDate = new Date();
      const pastDate = subDays(currentDate, days);

      const startDate = Math.floor(getTime(pastDate) / 1000);
      const endDate = Math.floor(getTime(currentDate) / 1000);

      return await ThegraphPancakeV3Service.findPoolDayData({
        id: poolId,
        startDate,
        endDate: endDate,
      });
    },
  );

  const handleOnClickSetDays = (days: number): void => {
    setDays(days);
  };

  const data = React.useMemo(() => {
    const feesPerDays = (field: keyof IPoolDayData): { field: number }[] => {
      const dates = Array.from({ length: days }, (_, i) => {
        return startOfDay(subDays(new Date(), i)).getTime();
      });

      const filedByDate = new Map<number, number>();

      poolDayData?.forEach((day) => {
        const dateKey = startOfDay(fromUnixTime(day.date)).getTime();
        const value = parseFloat(day[field] as string);

        if (filedByDate.has(dateKey)) {
          filedByDate.set(dateKey, filedByDate.get(dateKey)! + value);
        } else {
          filedByDate.set(dateKey, value);
        }
      });

      const chartData = dates.map((date) => ({
        field: filedByDate.get(date) || 0,
      }));

      const fileds = chartData.map((d) => d.field);
      const minFiled = Math.min(...fileds.filter((v) => v > 0));
      const maxFiled = Math.max(...fileds);

      const normalizedData = chartData.map((d) => {
        if (d.field === 0) return { field: 0 };
        const field = ((d.field - minFiled) / (maxFiled - minFiled)) * (300 - 0) + 0;
        return { field };
      });

      return normalizedData.reverse();
    };

    const feesTotal = (): number =>
      poolDayData?.reduce((total, day) => total + parseFloat(day.feesUSD), 0) ?? 0;

    return {
      feesTotal: feesTotal(),
      feesPerDays: feesPerDays('feesUSD'),
    };
  }, [poolDayData, days]);

  return (
    <div className="w-full">
      <div className="flex w-full justify-between gap-2 p-3">
        <div>
          <Typography.P className="text-xs text-secondary-200">Total fees</Typography.P>
          <Typography.H4>
            {isLoading ? 'Loading...' : numeral(data.feesTotal).format('0.00a')}
          </Typography.H4>
        </div>
        <div className="flex gap-2">
          <Button
            className={cn(days !== 30 && 'opacity-50')}
            size="sm"
            variant="outlineSecondary"
            onClick={() => handleOnClickSetDays(30)}
          >
            30d
          </Button>
          <Button
            className={cn(days !== 60 && 'opacity-50')}
            size="sm"
            variant="outlineSecondary"
            onClick={() => handleOnClickSetDays(60)}
          >
            60d
          </Button>
          <Button
            className={cn(days !== 90 && 'opacity-50')}
            size="sm"
            variant="outlineSecondary"
            onClick={() => handleOnClickSetDays(90)}
          >
            90d
          </Button>
          <Button
            className={cn(days !== 180 && 'opacity-50')}
            size="sm"
            variant="outlineSecondary"
            onClick={() => handleOnClickSetDays(180)}
          >
            180d
          </Button>
        </div>
      </div>
      <Chart className="max-h-[200px] min-h-[130px] w-full" config={config}>
        <AreaChart
          accessibilityLayer
          barCategoryGap={3}
          data={data.feesPerDays}
          margin={{
            left: 12,
            right: 12,
            top: 15,
          }}
        >
          <CartesianGrid
            stroke={colors.secondary[200]}
            strokeDasharray="3 3"
            strokeWidth={0.5}
            vertical={false}
          />
          <Area
            dataKey="field"
            fill="var(--color-field)"
            fillOpacity={0.2}
            stroke="var(--color-field)"
            strokeWidth={2}
            type="step"
          />
        </AreaChart>
      </Chart>
    </div>
  );
});

export default FeesChart;
