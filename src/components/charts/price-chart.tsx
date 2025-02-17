'use client';

import React from 'react';

import { colors } from '@/constants/colors';

import { Area, AreaChart, XAxis, YAxis, ReferenceLine } from 'recharts';

import Chart, { ChartConfig } from '../common/chart';
import Typography from '../common/typography';

const config = {
  field: {
    color: '#22c55e',
  },
} satisfies ChartConfig;

interface PriceChartProps {
  minPrice: number;
  maxPrice: number;
  data: { month: string; field: number }[];
}

const PriceChart = React.memo<PriceChartProps>(({ minPrice, maxPrice, data }) => (
  <Chart className="max-h-[155px] min-h-[130px] w-full" config={config}>
    <AreaChart
      data={data}
      margin={{
        left: 12,
        right: 12,
        top: 15,
      }}
    >
      <Area
        dataKey="field"
        fill="var(--color-field)"
        fillOpacity={0.05}
        stroke="var(--color-field)"
        strokeWidth={2}
        type="linear"
      />
      <XAxis
        axisLine={{ stroke: colors.secondary[400], strokeWidth: 1 }}
        dataKey="month"
        tick={{ fontSize: 9, fill: colors.secondary[400] }}
        tickFormatter={(value) => value.slice(0, 3)}
        tickLine={false}
        tickMargin={2}
      />
      <YAxis
        axisLine={false}
        orientation="right"
        tick={{ fontSize: 9, fill: colors.secondary[400] }}
        tickCount={5}
        tickLine={false}
        tickMargin={0}
      />
      <ReferenceLine
        isFront
        label={{
          content: (props: any) => (
            <foreignObject
              height={40}
              width={100}
              x={props.viewBox.x + 10}
              y={props.viewBox.y - 15}
            >
              <Typography.P className="inline-block rounded-sm bg-primary-500 px-[6px] text-[10px] font-bold text-secondary-950">
                MAX: {maxPrice}
              </Typography.P>
            </foreignObject>
          ),
        }}
        stroke="#FFE600"
        strokeDasharray="3 3"
        strokeWidth={2}
        y={maxPrice}
      />
      <ReferenceLine
        isFront
        label={{
          content: (props: any) => (
            <foreignObject height={40} width={100} x={props.viewBox.x + 10} y={props.viewBox.y - 2}>
              <Typography.P className="inline-block rounded-sm bg-primary-500 px-[6px] text-[10px] font-bold text-secondary-950">
                MIN: {minPrice}
              </Typography.P>
            </foreignObject>
          ),
        }}
        stroke="#FFE600"
        strokeDasharray="3 3"
        strokeWidth={2}
        y={minPrice}
      />
    </AreaChart>
  </Chart>
));

export default PriceChart;
