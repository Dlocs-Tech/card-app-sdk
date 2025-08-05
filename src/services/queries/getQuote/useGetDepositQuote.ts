import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TDepositQuoteData = {
  platformFee: string;
  businessFee: string;
  providerFee: string;
  totalFee: string;
  amountToReceive: string;
  amountToSend: string;
  minimumDepositAmount: string;
};

/* Response */
export type TGetDepositQuoteResponse = TBaseResponse & {
  data: TDepositQuoteData;
};

/* Props */
export type TGetDepositQuoteProps = {
  amount: string;
  cardId: number;
  tierId?: number;
};

/* Hook */
export const useGetDepositQuote = ({
  amount,
  cardId,
  tierId,
  enabled,
  onError,
  refetchInterval,
}: TGetDepositQuoteProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getDepositQuote', amount, cardId, tierId],
    enabled,
    onError,
    refetchInterval,
    queryFn: async () => {
      const queryUrl = new URL(`${cardAppApiUrl}/v1/deposit/quote`);
      queryUrl.searchParams.set('amount', amount);
      queryUrl.searchParams.set('cardId', cardId.toString());

      if (tierId) {
        queryUrl.searchParams.set('tierId', tierId.toString());
      }

      const response = await axios.get(queryUrl.toString(), {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const depositQuote: TGetDepositQuoteResponse = response.data;
      return depositQuote.data;
    },
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
