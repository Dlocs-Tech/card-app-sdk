import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';
import type { TOnchainUserTx } from './useGetOnchainUserTxs';

/* Response */
export type TGetOnchainUserCardTxsResponse = TBaseResponse & {
  data: {
    total: number;
    records: TOnchainUserTx[];
  };
};

/* Props */
export type TGetOnchainUserCardTxsProps = {
  userId: number;
  cardId: number;
  requestData: {
    pageNum: number;
    pageSize: number;
    orderNo?: string;
    startTime?: number;
    endTime?: number;
  };
};

/* Hook */
export const useGetOnchainUserCardTxs = ({
  userId,
  cardId,
  requestData,
  onError,
  enabled,
}: TGetOnchainUserCardTxsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getOnchainUserCardTxs', userId, cardId, requestData],
    onError,
    queryFn: async () => {
      if (!userId || !cardId || !requestData.pageNum || !requestData.pageSize)
        throw new Error('User ID, cardId, pageNum, and pageSize are required');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const response = await axios.post(
        `${cardAppApiUrl}/v2/transactions/${userId}/onchain/${cardId}`,
        filteredRequestData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const onchainUserCardTxs: TGetOnchainUserCardTxsResponse = response.data;
      return onchainUserCardTxs.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
