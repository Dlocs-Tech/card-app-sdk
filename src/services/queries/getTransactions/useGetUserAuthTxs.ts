import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useCardAppContext } from '../../../providers';
import { STALE_TIME } from '../../../constants';
import type { TBaseResponse, TGenericQuery } from '../../../types';

/* Types */
export type TUserAuthTx = {
  cardNo: string;
  tradeNo: string;
  originTradeNo: string;
  currency: string;
  amount: string;
  authorizedAmount: string;
  authorizedCurrency: string;
  fee: string;
  feeCurrency: string;
  crossBoardFee: string;
  crossBoardFeeCurrency: string;
  settleAmount: number;
  settleCurrency: string;
  settleDate: number;
  merchantName: string;
  type: 'AUTHORIZED' | 'REFUND' | 'VERIFICATION' | 'VOID' | 'MAINTAIN_FEE';
  typeStr: string;
  status: string;
  statusStr: string;
  description: string;
  transactionTime: number;
};

/* Response */
export type TGetUserAuthTxsResponse = TBaseResponse & {
  data: {
    total: number;
    records: TUserAuthTx[];
  };
};

/* Props */
export type TGetUserAuthTxsProps = {
  userId: number;
  cardId: number;
  requestData: {
    pageNum: number;
    pageSize: number;
    orderNo?: string;
    startTime?: number;
    endTime?: number;
    type?: 'AUTH' | 'REFUND' | 'VERIFICATION' | 'VOID' | 'MAINTAIN_FEE';
  };
};

/* Hook */
export const useGetUserAuthTxs = ({
  userId,
  cardId,
  requestData,
  onError,
  enabled,
}: TGetUserAuthTxsProps & TGenericQuery) => {
  const { cardAppApiKey, cardAppApiUrl } = useCardAppContext();

  return useQuery({
    queryKey: ['getUserAuthTxs', userId, cardId, requestData],
    onError,
    queryFn: async () => {
      if (!userId || !cardId || !requestData.pageNum || !requestData.pageSize)
        throw new Error('User ID, cardId, pageNum, and pageSize are required');

      const filteredRequestData = Object.fromEntries(
        Object.entries(requestData).filter(([, value]) => value !== undefined)
      );

      const response = await axios.post(
        `${cardAppApiUrl}/v2/transactions/${userId}/auth/${cardId}`,
        filteredRequestData,
        {
          headers: {
            'x-api-key': cardAppApiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      const userAuthTxs: TGetUserAuthTxsResponse = response.data;
      return userAuthTxs.data;
    },
    enabled: !!enabled,
    staleTime: STALE_TIME,
  });
};
