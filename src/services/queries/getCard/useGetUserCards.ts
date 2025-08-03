import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TGenericQuery } from '../../../types/globals';

/* Types */
export type TGetUserCardsProps = {
  userId: number;
};

export type TUserCard = {
  id: number;
  cardNo: string;
};

export type TGetUserCardsResponse = {
  success: boolean;
  code: number;
  msg: string;
  data: TUserCard[];
};

/* Hook */
export const useGetUserCards = ({
  userId,
  onError,
  enabled,
}: TGetUserCardsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserCards', userId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');

      const response = await axios.get(
        `${cardAppApiUrl}/v2/cards/${userId}/cards`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const userCards: TGetUserCardsResponse = response.data;
      return userCards.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
