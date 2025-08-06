import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';
import type { TBalanceInfo } from './useGetUserCardInfo';

/* Response */
export type TGetUserSingleCardBalanceResponse = TBaseResponse & {
  data: TBalanceInfo;
};

/* Props */
export type TGetUserSingleCardBalanceProps = {
  userId: number;
  cardId: number;
};

/* Hook */
export const useGetUserSingleCardBalance = ({
  userId,
  cardId,
  onError,
  enabled,
}: TGetUserSingleCardBalanceProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserSingleCardBalance', userId, cardId],
    onError,
    queryFn: async () => {
      if (!userId) throw new Error('User ID is missing');
      if (!cardId) throw new Error('Card ID is missing');

      const response = await axios.get(
        `${cardAppApiUrl}/v2/cards/${userId}/balance/${cardId}`,
        {
          headers: { 'x-api-key': cardAppApiKey },
        }
      );

      const userSingleCardBalance: TGetUserSingleCardBalanceResponse =
        response.data;
      return userSingleCardBalance.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
