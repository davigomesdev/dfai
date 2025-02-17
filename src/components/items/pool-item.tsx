import React from 'react';

import { IPool, IPoolDayData } from '@/interfaces/pool.interface';

import { cn } from '@/utils/cn.util';
import { subDays, startOfDay, fromUnixTime } from 'date-fns';

import { colors } from '@/constants/colors';

import { Area, AreaChart, Bar, BarChart } from 'recharts';

import Card from '../common/card';
import Separator from '../common/separator';
import Typography from '../common/typography';
import Chart, { ChartConfig } from '../common/chart';

const chartVolumeConfig = {
  field: {
    color: colors.primary[500],
  },
} satisfies ChartConfig;

const chartTVLAndFeesConfig = {
  field: {
    color: '#22c55e',
  },
} satisfies ChartConfig;

interface PoolItemProps extends IPool {
  isActive?: boolean;
  onClick?: () => void;
}

const PoolItem = React.memo<PoolItemProps>(({ feeTier, poolDayData, isActive, onClick }) => {
  const processChartData = React.useMemo(() => {
    const processField = (field: keyof IPoolDayData): { field: number }[] => {
      const dates = Array.from({ length: 30 }, (_, i) => {
        return startOfDay(subDays(new Date(), i)).getTime();
      });

      const volumeByDate = new Map<number, number>();

      poolDayData.forEach((day) => {
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
        if (d.field === 0) return { field: 30 };
        const field = ((d.field - minVolume) / (maxVolume - minVolume)) * (300 - 30) + 30;
        return { field };
      });

      return normalizedData.reverse();
    };
    return {
      volumeData: processField('volumeUSD'),
      tvlData: processField('tvlUSD'),
      feesData: processField('feesUSD'),
    };
  }, [poolDayData]);

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-colors',
        poolDayData.length == 0 && 'pointer-events-none opacity-50',
        isActive
          ? 'border-primary-500 bg-primary-500/10 text-green-500/50'
          : 'hover:border-primary-500/50 hover:bg-primary-500/5',
      )}
      onClick={onClick}
    >
      <Card.Header
        className={cn(
          'bg-secondary-950 py-2 transition-colors',
          isActive ? 'bg-primary-500/40' : 'group-hover:bg-primary-500/10',
        )}
      >
        <Typography.H4>{(Number(feeTier) / 10000).toFixed(2)}%</Typography.H4>
      </Card.Header>
      <Separator
        className={cn(
          'bg-secondary-800 transition-colors',
          isActive ? 'bg-primary-500' : 'group-hover:bg-primary-500/50',
        )}
      />
      <Card.Content className="p-4">
        {poolDayData.length > 0 ? (
          ((): JSX.Element => {
            const volumeUSD = parseFloat(poolDayData[0].volumeUSD);
            const tvl30d = parseFloat(poolDayData[0].tvlUSD);
            const fees30d = parseFloat(poolDayData[0].feesUSD);

            const feesToTVLRatio = tvl30d > 0 ? fees30d / tvl30d : 0;

            return (
              <ul className="space-y-4">
                <li>
                  <Typography.P className="text-[0.6rem] text-secondary-200">
                    volume 30d
                  </Typography.P>
                  <Typography.P
                    className="text-sm"
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ${volumeUSD.toLocaleString()}
                  </Typography.P>
                  <div>
                    <Chart
                      className="pointer-events-none max-h-[30px] min-h-[30px] w-full"
                      config={chartVolumeConfig}
                    >
                      <BarChart barCategoryGap={1} data={processChartData.volumeData}>
                        <Bar dataKey="field" fill="var(--color-field)" />
                      </BarChart>
                    </Chart>
                  </div>
                </li>
                <li>
                  <Typography.P className="text-[0.6rem] text-secondary-200">TVL 30d</Typography.P>
                  <Typography.P
                    className="text-sm"
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ${tvl30d.toLocaleString()}
                  </Typography.P>
                  <div>
                    <Chart
                      className="pointer-events-none max-h-[30px] min-h-[30px] w-full"
                      config={chartTVLAndFeesConfig}
                    >
                      <AreaChart data={processChartData.tvlData}>
                        <Area
                          dataKey="field"
                          fill="var(--color-field)"
                          fillOpacity={0.1}
                          stroke="var(--color-field)"
                          type="linear"
                        />
                      </AreaChart>
                    </Chart>
                  </div>
                </li>
                <li>
                  <Typography.P className="text-[0.6rem] text-secondary-200">
                    fees/TVL 30d
                  </Typography.P>
                  <Typography.P
                    className="text-sm"
                    style={{
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {feesToTVLRatio.toFixed(11)}
                  </Typography.P>
                  <div>
                    <Chart
                      className="pointer-events-none max-h-[30px] min-h-[30px] w-full"
                      config={chartTVLAndFeesConfig}
                    >
                      <AreaChart data={processChartData.feesData}>
                        <Area
                          dataKey="field"
                          fill="var(--color-field)"
                          fillOpacity={0.1}
                          stroke="var(--color-field)"
                          type="linear"
                        />
                      </AreaChart>
                    </Chart>
                  </div>
                </li>
              </ul>
            );
          })()
        ) : (
          <Typography.P className="text-sm text-secondary-200">
            No liquidity data for this pool
          </Typography.P>
        )}
      </Card.Content>
    </Card>
  );
});

export default PoolItem;
