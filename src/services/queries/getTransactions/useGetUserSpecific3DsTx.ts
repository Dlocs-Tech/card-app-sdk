import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';
import type { TUser3DsTx } from './useGetUser3DsTxs';

/* Response */
export type TGetUserSpecific3DsTxResponse = TBaseResponse & {
  data: TUser3DsTx;
};

/* Props */
export type TGetUserSpecific3DsTxProps = {
  userId: number;
  cardId: number;
  tradeNo: number;
};

/* Hook */
export const useGetUserSpecific3DsTx = ({
  userId,
  cardId,
  tradeNo,
  onError,
  enabled,
}: TGetUserSpecific3DsTxProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserSpecific3DsTx', userId, cardId, tradeNo],
    onError,
    queryFn: async () => {
      if (!userId || !cardId || !tradeNo)
        throw new Error('User ID, cardId, tradeNo are required');

      const response = await axios.get(
        `${cardAppApiUrl}/v2/transactions/${userId}/3ds/${cardId}/${tradeNo}`,
        {
          headers: {
            'x-api-key': cardAppApiKey,
          },
        }
      );

      const userSpecific3DsTx: TGetUserSpecific3DsTxResponse = response.data;
      return userSpecific3DsTx.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
