import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TCreateCardQuoteDataResponse = {
  platformFee: string;
  businessFee: string;
  providerFee: string;
  amountToReceive: string;
  amountToSend: string;
};

export type TGetCreateCardQuoteResponse = {
  code: number;
  msg: string;
  success: boolean;
  data: TCreateCardQuoteDataResponse;
};

export type TGetCreateCardQuoteProps = {
  holderId?: number;
  tierId?: number;
};

/* Hook */
export const useGetCreateCardQuote = ({
  holderId,
  tierId,
  enabled,
  onError,
  refetchInterval,
}: TGetCreateCardQuoteProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getCreateCardQuote', holderId, tierId],
    enabled,
    onError,
    refetchInterval,
    queryFn: async () => {
      const queryUrl = new URL(`${cardAppApiUrl}/v2/cards/quote`);

      if (holderId) {
        queryUrl.searchParams.set('holderId', holderId.toString());
      }

      if (tierId) {
        queryUrl.searchParams.set('tierId', tierId.toString());
      }

      const response = await axios.get(queryUrl.toString(), {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const depositQuote: TGetCreateCardQuoteResponse = response.data;
      return depositQuote.data;
    },
    cacheTime: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};
