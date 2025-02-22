'use client';

import React from 'react';

import { IToken } from '@/interfaces/token.interface';

import * as ERC20Service from '@/services/erc20/erc20.service';

import { balanceOfEther } from '@/utils/ethers.util';
import { formatNumber, truncateNumber } from '@/utils/format.util';

import useSWR from 'swr';

import Typography from '../common/typography';
import DefaultIcon from '../partials/default-icon';

interface TokenItemProps extends IToken {
  onClick: () => void;
}

const TokenItem: React.FC<TokenItemProps> = ({
  id,
  name,
  symbol,
  address,
  decimals,
  logoURI,
  isNative,
  onClick,
}) => {
  const { data: balance, isLoading } = useSWR<bigint>(
    id,
    async () => {
      if (isNative) {
        return await balanceOfEther();
      } else {
        return await ERC20Service.balanceOf({ address });
      }
    },
    {
      errorRetryCount: 0,
    },
  );

  return (
    <li
      className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-secondary-800 bg-secondary-950/50 px-4 py-2 transition-colors hover:border-primary-500/50 hover:bg-primary-500/10"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {logoURI ? (
          <img alt="Token" className="h-7 w-7" src={logoURI} />
        ) : (
          <DefaultIcon symbol={symbol} />
        )}
        <div>
          <Typography.P className="font-semibold">{symbol}</Typography.P>
          <Typography.P className="text-xs text-secondary-200">{name}</Typography.P>
        </div>
      </div>
      {isLoading ? (
        <Typography.P className="font-mono text-sm text-secondary-200">
          Fetch balance...<span className="ml-1 animate-blink">|</span>
        </Typography.P>
      ) : (
        <Typography.P className="font-semibold text-secondary-200">
          {balance ? truncateNumber(formatNumber(balance, decimals), 6) : 0}
        </Typography.P>
      )}
    </li>
  );
};

export default TokenItem;
