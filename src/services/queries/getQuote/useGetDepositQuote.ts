import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TQuote = {
  to: string;
  data: string;
};

export type TDepositQuoteResponse = {
  txId: number;
  quotes: TQuote[];
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
