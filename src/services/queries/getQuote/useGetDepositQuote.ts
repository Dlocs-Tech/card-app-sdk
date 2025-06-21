import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TDepositQuoteResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bridgeExtraInfo: any;
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
  const { cardAppApiKey } = useCardAppContext();

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
        `${API_URL}/bridge/pre-deposit/${userId}`,
        filteredQuoteParams,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const depositQuote: TGetDepositQuoteResponse = response.data;
      return depositQuote;
    },
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
