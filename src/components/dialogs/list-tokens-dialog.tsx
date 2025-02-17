import React from 'react';

import { IToken } from '@/interfaces/token.interface';

import { useTokens } from '@/hooks/use-tokens';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { CircleHelp } from 'lucide-react';

import Input from '../common/input';
import Button from '../common/button';
import Dialog from '../common/dialog';
import Tooltip from '../common/tooltip';
import TokenItem from '../items/token-item';
import Typography from '../common/typography';
import DefaultIcon from '../partials/default-icon';

type TImportResult = {
  token: IToken | null;
  exists: boolean;
};

interface ListTokensDialog {
  param: string;
  children: React.ReactNode;
}

const ListTokensDialog: React.FC<ListTokensDialog> = ({ param, children }) => {
  const { tokens, importToken } = useTokens();

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [open, setOpen] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [importResult, setImportResult] = React.useState<TImportResult | null>(null);

  const searchToken = (term: string): IToken[] => {
    const lowerCaseTerm = term.toLowerCase();
    return tokens.filter(
      (token) =>
        token.name.toLowerCase().includes(lowerCaseTerm) ||
        token.symbol.toLowerCase().includes(lowerCaseTerm) ||
        token.address.toLowerCase().includes(lowerCaseTerm),
    );
  };

  const searchTokenImport = async (address: string): Promise<void> => {
    await importToken(address);
  };

  const handleOnClickTokenItem = (id: string): void => {
    const params = new URLSearchParams(searchParams);

    for (const [key, paramValue] of params.entries()) {
      if (paramValue === id && params.get(param) !== id) {
        params.delete(key);
      }
    }

    params.set(param, id);
    const newPath = `${location.pathname}?${params.toString()}`;

    navigate(newPath);
    setOpen(false);
  };

  const filteredTokens = searchTerm ? searchToken(searchTerm) : tokens;

  React.useEffect(() => {
    if (searchTerm && filteredTokens.length === 0) {
      searchTokenImport(searchTerm);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    if (open) setSearchTerm('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[530px]">
        <Dialog.Header>
          <Dialog.Title className="text-center">Select a Token</Dialog.Title>
        </Dialog.Header>
        <div className="space-y-4 px-4 pb-6">
          <div className="space-y-4 px-2">
            <Input
              placeholder="Search name or paste address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dialog.Description className="flex items-center gap-1">
              Common bases
              <Tooltip.Provider>
                <Tooltip>
                  <Tooltip.Trigger asChild>
                    <CircleHelp size={15} />
                  </Tooltip.Trigger>
                  <Tooltip.Content className="max-w-[300px]">
                    <Typography.P className="text-sm text-white">
                      These tokens are commonly paired with other tokens.
                    </Typography.P>
                  </Tooltip.Content>
                </Tooltip>
              </Tooltip.Provider>
            </Dialog.Description>
          </div>
          <div className="mt-5 max-h-[calc(100vh-500px)] w-full overflow-y-auto px-2">
            <ul className="w-full space-y-3">
              {filteredTokens.map((token, index) => (
                <TokenItem
                  key={index}
                  {...token}
                  onClick={() => handleOnClickTokenItem(token.id)}
                />
              ))}
              {importResult ? (
                importResult.token ? (
                  <li className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-secondary-800 bg-secondary-950/50 px-4 py-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <DefaultIcon symbol={importResult.token.symbol} />
                      <div>
                        <Typography.P className="font-semibold">
                          {importResult.token.symbol}
                        </Typography.P>
                        <Typography.P className="text-xs text-secondary-200">
                          {importResult.token.name}
                        </Typography.P>
                      </div>
                    </div>
                    <Button variant="outline">Import</Button>
                  </li>
                ) : (
                  <li>
                    <Typography.P className="font-semibold text-secondary-600">
                      Enter valid token address
                    </Typography.P>
                  </li>
                )
              ) : null}
            </ul>
          </div>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export default ListTokensDialog;
