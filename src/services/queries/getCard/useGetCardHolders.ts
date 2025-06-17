import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { API_URL } from '../../../constants';
import type { IGenericQuery } from '../../../types/globals';
import type { TCardHolder } from './useGetCardHolder';

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
}: TGetCardHoldersProps & IGenericQuery) => {
  const { cardAppApiKey } = useCardAppContext();

  return useQuery({
    queryKey: ['getCardHolders', userId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');

      const response = await axios.get(`${API_URL}/banking/${userId}/holder`, {
        headers: { 'x-api-key': cardAppApiKey },
      });

      const cardHolders: TGetCardHoldersResponse = response.data;
      return cardHolders;
    },
    enabled: !!enabled,
  });
};
