import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TUser3DsTx = {
  cardNo: string;
  tradeNo: string;
  originTradeNo: string;
  currency: string;
  amount: string;
  merchantName: string;
  values: string;
  type: 'THIRD_3DS_OTP' | 'AUTH_URL';
  transactionTime: number;
  description: string;
};

/* Response */
export type TGetUser3DsTxsResponse = TBaseResponse & {
  data: {
    total: number;
    records: TUser3DsTx[];
  };
};

/* Props */
export type TGetUser3DsTxsProps = {
  userId: number;
  cardId: number;
  requestData: {
    pageNum: number;
    pageSize: number;
    orderNo?: string;
    cardNo?: string;
    startTime?: number;
    endTime?: number;
    type?: 'THIRD_3DS_OTP' | 'AUTH_URL';
  };
};

/* Hook */
export const useGetUser3DsTxs = ({
  userId,
  cardId,
  requestData,
  onError,
  enabled,
}: TGetUser3DsTxsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUser3DsTxs', userId, cardId, requestData],
    onError,
    queryFn: async () => {
      if (!userId || !cardId || !requestData.pageNum || !requestData.pageSize)
        throw new Error('User ID, cardId, pageNum, and pageSize are required');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const response = await axios.post(
        `${cardAppApiUrl}/v2/transactions/${userId}/3ds/${cardId}`,
        filteredRequestData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const user3DsTxs: TGetUser3DsTxsResponse = response.data;
      return user3DsTxs.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
