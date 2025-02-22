'use client';

import React from 'react';

import { colors } from '@/constants/colors';

import { IPoolDayData } from '@/interfaces/pool.interface';

import * as ThegraphPancakeV3Service from '@/services/thegraph-pancake-v3/thegraph-pancake-v3.service';

import { cn } from '@/utils/cn.util';
import numeral from 'numeral';
import { fromUnixTime, getTime, startOfDay, subDays } from 'date-fns';

import useSWR from 'swr';

import { BarChart, Bar, CartesianGrid } from 'recharts';

import Button from '../common/button';
import Typography from '../common/typography';
import Chart, { ChartConfig } from '../common/chart';

const config = {
  field: {
    color: colors.primary[500],
  },
} satisfies ChartConfig;

interface VolumeChartProps {
  id: string;
}

const VolumeChart = React.memo<VolumeChartProps>(({ id }) => {
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
    const volumesPerDays = (field: keyof IPoolDayData): { field: number }[] => {
      const dates = Array.from({ length: days }, (_, i) => {
        return startOfDay(subDays(new Date(), i)).getTime();
      });

      const volumeByDate = new Map<number, number>();

      poolDayData?.forEach((day) => {
        const dateKey = startOfDay(fromUnixTime(day.date)).getTime();
        const value = parseFloat(day[field] as string);

        if (volumeByDate.has(dateKey)) {
          volumeByDate.set(dateKey, volumeByDate.get(dateKey)! + value);
        } else {
          volumeByDate.set(dateKey, value);
        }
      });

      const chartData = dates.map((date) => ({
        field: volumeByDate.get(date) || 0,
      }));

      const volumes = chartData.map((d) => d.field);
      const minVolume = Math.min(...volumes.filter((v) => v > 0));
      const maxVolume = Math.max(...volumes);

      const normalizedData = chartData.map((d) => {
        if (d.field === 0) return { field: 0 };
        const field = ((d.field - minVolume) / (maxVolume - minVolume)) * (300 - 0) + 0;
        return { field };
      });

      return normalizedData.reverse();
    };

    const volumeTotal = (): number =>
      poolDayData?.reduce((total, day) => total + parseFloat(day.volumeUSD), 0) ?? 0;

    return {
      volumeTotal: volumeTotal(),
      volumePerDays: volumesPerDays('volumeUSD'),
    };
  }, [poolDayData, days]);

  return (
    <div className="w-full">
      <div className="flex w-full justify-between gap-2 p-3">
        <div>
          <Typography.P className="text-xs text-secondary-200">Total volume</Typography.P>
          <Typography.H4>
            {isLoading ? 'Loading...' : numeral(data.volumeTotal).format('0.00a')}
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
        <BarChart
          barCategoryGap={2}
          data={data.volumePerDays}
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
          <Bar
            dataKey="field"
            fill="var(--color-field)"
            fillOpacity={0.5}
            stroke="var(--color-field)"
            strokeWidth={1}
          />
        </BarChart>
      </Chart>
    </div>
  );
});

export default VolumeChart;
