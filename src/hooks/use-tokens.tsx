import React from 'react';

import { tokens as tokensBase } from '@/assets/tokens/tokens.json';

import * as ERC20Services from '@/services/erc20/erc20.service';

import { IToken } from '@/interfaces/token.interface';

import { useLocalStorage } from './use-local-storage';

export interface IUseTokens {
  tokens: IToken[];
  findToken: (address: string) => IToken | null;
  importToken: (address: string) => Promise<IToken | null>;
}

export const useTokens = (): IUseTokens => {
  const [tokens, setTokens] = React.useState<IToken[]>([]);
  const [importedTokens, setImportedTokens] = useLocalStorage<IToken[]>('importedTokens', []);

  const findToken = (id: string): IToken | null => {
    return tokens.find((token) => token.id.toLowerCase() === id.toLowerCase()) ?? null;
  };

  const importToken = async (address: string): Promise<IToken | null> => {
    const existingToken = tokens.find(
      (token) => token.address.toLowerCase() === address.toLowerCase(),
    );

    if (existingToken) return existingToken;

    const metadata = await ERC20Services.getMetadata(address).catch(() => null);

    if (!metadata) return null;

    const newToken: IToken = {
      id: address,
      name: metadata.name,
      symbol: metadata.symbol,
      decimals: Number(metadata.decimals),
      address: address,
      isNative: false,
      logoURI: null,
    };

    setImportedTokens([...importedTokens, newToken]);

    return newToken;
  };

  React.useEffect(() => {
    const uniqueTokens = new Map<string, IToken>();

    [...tokensBase, ...importedTokens].forEach((token) => {
      uniqueTokens.set(token.id.toLowerCase(), token);
    });

    setTokens(Array.from(uniqueTokens.values()));
  }, [tokensBase, importedTokens]);

  return { tokens, findToken, importToken };
};
