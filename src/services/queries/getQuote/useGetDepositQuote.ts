import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TTokenInfo = {
  symbol: string;
  icon?: string;
  address: string;
  amount: string;
  chainId: number;
  decimals: number;
};

export type TRoute = {
  provider: string;
  tokens: TTokenInfo[];
};

export type TFee = {
  provider: string;
  value: TTokenInfo;
  save: TTokenInfo;
  description: string;
};

export type TDepositTransaction = {
  chainId: number;
  data: string;
  to: string;
  value: string;
};

export type TBridgeExtraInfo = {
  fee: TTokenInfo;
  route: TRoute[];
  inTradeType: string;
  outTradeType: string;
  fees: TFee[];
  routes: TRoute[];
  kind: string;
  priceImpact: string;
  tokenAmountOut: TTokenInfo;
  tokenAmountOutMin: TTokenInfo;
  amountInUsd: TTokenInfo;
  approveTo: string;
  type: string;
  rewards: unknown[];
  estimatedTime: number;
  tx: TDepositTransaction;
};

export type TDepositQuoteResponse = {
  bridgeExtraInfo: TBridgeExtraInfo;
  txId: number;
  quotes: {
    to: string;
    data: string;
  }[];
};

export type TGetDepositQuoteResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TDepositQuoteResponse;
};

export type TGetDepositQuoteProps = {
  userId: number;
  quoteParams: {
    amount: string;
    holderId: number;
    slippage: number;
    cardId?: number;
  };
};

/* Hook */
export const useGetDepositQuote = ({
  userId,
  quoteParams,
  enabled,
  onError,
  refetchInterval,
}: TGetDepositQuoteProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: [
      'getDepositQuote',
      userId,
      quoteParams.amount,
      quoteParams.holderId,
      quoteParams.slippage,
      quoteParams.cardId,
    ],
    enabled,
    onError,
    refetchInterval,
    queryFn: async () => {
      const filteredQuoteParams = Object.fromEntries(
        Object.entries(quoteParams).filter(([, value]) => value !== undefined)
      );

      const response = await axios.post(
        `${cardAppApiUrl}/bridge/pre-deposit/${userId}`,
        filteredQuoteParams,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const depositQuote: TGetDepositQuoteResponse = response.data;
      return depositQuote.data;
    },
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
