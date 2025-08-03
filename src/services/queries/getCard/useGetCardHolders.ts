import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import type { TGenericQuery } from '../../../types/globals';
import type { TCardHolder } from './useGetCardHolderWithId';

/* Types */
export type TGetCardHoldersProps = {
  userId: number;
};

export type TGetCardHoldersResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: { total: number; records: TCardHolder[] };
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
