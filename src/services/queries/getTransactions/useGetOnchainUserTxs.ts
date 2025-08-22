import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TOnchainUserTx = {
  createdAt: string;
  updatedAt: string;
  id: number;
  orderNo: string;
  status: string;
  type: string;
  transactionTime: string;
  userId: number;
  amount: string;
  blockTimestamp: number;
  description: string;
  tierId: number;
};

/* Response */
export type TGetOnchainUserTxsResponse = TBaseResponse & {
  data: TOnchainUserTx[];
};

/* Props */
export type TGetOnchainUserTxsProps = {
  userId: number;
  requestData: {
    pageNum: number;
    pageSize: number;
    orderNo?: string;
    startTime?: number;
    endTime?: number;
  };
};

/* Hook */
export const useGetOnchainUserTxs = ({
  userId,
  requestData,
  onError,
  enabled,
}: TGetOnchainUserTxsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getOnchainUserTxs', userId, requestData],
    onError,
    queryFn: async () => {
      if (!userId || !requestData.pageNum || !requestData.pageSize)
        throw new Error('User ID, pageNum, and pageSize are required');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const response = await axios.post(
        `${cardAppApiUrl}/v2/transactions/${userId}/onchain`,
        filteredRequestData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const onchainUserTxs: TGetOnchainUserTxsResponse = response.data;
      return onchainUserTxs.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
