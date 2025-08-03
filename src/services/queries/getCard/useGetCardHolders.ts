import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TBaseResponse, TGenericQuery } from '../../../types';
import type { TCardHolder } from './useGetCardHolderWithId';

/* Response */
export type TGetCardHoldersResponse = TBaseResponse & {
  data: { total: number; records: TCardHolder[] };
};

/* Props */
export type TGetCardHoldersProps = {
  userId: number;
};

/* Hook */
export const useGetCardHolders = ({
  userId,
  onError,
  enabled,
}: TGetCardHoldersProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getCardHolders', userId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');

      const response = await axios.get(
        `${cardAppApiUrl}/v1/banking/${userId}/holder`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const cardHolders: TGetCardHoldersResponse = response.data;
      return cardHolders.data;
    },
    enabled: !!enabled,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
  });
};
