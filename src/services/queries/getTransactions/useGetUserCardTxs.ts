import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TUserCardTx = {
  orderNo: string;
  originOrderNo: string;
  merchantOrderNo: string;
  cardNo: string;
  currency: string;
  amount: string;
  fee: string;
  receivedAmount: string;
  receivedCurrency: string;
  type: 'CREATE' | 'DEPOSIT' | 'CANCEL' | 'FREEZE' | 'UNFREEZE' | 'WITHDRAW';
  subType: string;
  status: string;
  remark: string;
  transactionTime: number;
};

/* Response */
export type TGetUserCardTxsResponse = TBaseResponse & {
  data: {
    total: number;
    records: TUserCardTx[];
  };
};

/* Props */
export type TGetUserCardTxsProps = {
  userId: number;
  cardId: number;
  requestData: {
    pageNum: number;
    pageSize: number;
    orderNo?: string;
    startTime?: number;
    endTime?: number;
    type?: 'CREATE' | 'DEPOSIT' | 'CANCEL' | 'FREEZE' | 'UNFREEZE' | 'WITHDRAW';
  };
};

/* Hook */
export const useGetUserCardTxs = ({
  userId,
  cardId,
  requestData,
  onError,
  enabled,
}: TGetUserCardTxsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserCardTxs', userId, cardId, requestData],
    onError,
    queryFn: async () => {
      if (!userId || !cardId || !requestData.pageNum || !requestData.pageSize)
        throw new Error('User ID, cardId, pageNum, and pageSize are required');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const response = await axios.post(
        `${cardAppApiUrl}/v2/transactions/${userId}/card/${cardId}`,
        filteredRequestData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const userCardTxs: TGetUserCardTxsResponse = response.data;
      return userCardTxs.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
