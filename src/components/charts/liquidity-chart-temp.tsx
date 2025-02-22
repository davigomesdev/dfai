'use client';

import React from 'react';

import { colors } from '@/constants/colors';

import { XAxis, ReferenceLine, BarChart, Bar } from 'recharts';

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

const LiquidityChart = React.memo<PriceChartProps>(({ minPrice, maxPrice, data }) => (
  <Chart className="max-h-[155px] min-h-[130px] w-full" config={config}>
    <BarChart
      barCategoryGap={3}
      data={data}
      margin={{
        left: 12,
        right: 12,
        top: 15,
      }}
    >
      <Bar dataKey="field" fill="var(--color-field)" />
      <XAxis
        axisLine={{ stroke: colors.secondary[400], strokeWidth: 1 }}
        dataKey="month"
        tick={{ fontSize: 9, fill: colors.secondary[400] }}
        tickFormatter={(value) => value.slice(0, 3)}
        tickLine={false}
        tickMargin={2}
      />
      <ReferenceLine
        isFront
        label={{
          content: (props: any) => (
            <foreignObject
              height={40}
              width={100}
              x={props.viewBox.x - 30}
              y={props.viewBox.y - 10}
            >
              <Typography.P className="inline-block rounded-sm bg-primary-500 px-[6px] text-[10px] font-bold text-secondary-950">
                MIN: {minPrice}
              </Typography.P>
            </foreignObject>
          ),
        }}
        stroke="#FFE600"
        strokeDasharray="3 3"
        strokeWidth={2}
        x={0}
      />
      <ReferenceLine
        isFront
        label={{
          content: (props: any) => (
            <foreignObject
              height={40}
              width={100}
              x={props.viewBox.x - 30}
              y={props.viewBox.y - 10}
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
        x={5}
      />
    </BarChart>
  </Chart>
));

export default LiquidityChart;
