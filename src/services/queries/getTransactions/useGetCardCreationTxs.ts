import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TCardCreationTx = {
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
export type TGetCardCreationTxsResponse = TBaseResponse & {
  data: {
    total: number;
    records: TCardCreationTx[];
  };
};

/* Props */
export type TGetCardCreationTxsProps = {
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
export const useGetCardCreationTxs = ({
  userId,
  requestData,
  onError,
  enabled,
}: TGetCardCreationTxsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getCardCreationTxs', userId, requestData],
    onError,
    queryFn: async () => {
      if (!userId || !requestData.pageNum || !requestData.pageSize)
        throw new Error('User ID, pageNum, and pageSize are required');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const response = await axios.post(
        `${cardAppApiUrl}/v2/transactions/${userId}/card/creation`,
        filteredRequestData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const cardCreationTxs: TGetCardCreationTxsResponse = response.data;
      return cardCreationTxs.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
